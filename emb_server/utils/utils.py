import re
import os

import json

from exceptions_results import OperationResult

from services.openai_service import get_transcription, get_transcription2, transcribe_audio_ro

from langchain.document_loaders import UnstructuredFileLoader
from langchain.text_splitter import CharacterTextSplitter

def is_youtube_video(url):
    youtube_regex = (
        r'(https?://)?(www\.)?'
        '(youtube|youtu|youtube-nocookie)\.(com|be)/'
        '(watch\?v=|embed/|v/|.+\?v=)?([^&=%\?]{11})'
    )

    youtube_regex_match = re.match(youtube_regex, url)
    if youtube_regex_match:
        return True
    else:
        return False


def build_youtube_url(video_id):
    base_url = "https://www.youtube.com/watch?v="
    return base_url + video_id


def is_3d_related_text(text):
    keywords = ["3d", "three-dimensional", "stereoscopic", "3-d", "autocad",
                "3ds max", "blender", "cinema 4d", "maya", "zbrush",
                "3d printing", "3d scanner", "3d modeling", "3d rendering",
                "VR", "AR", "virtual reality", "augmented reality"]

    text_lower = text.lower()

    for keyword in keywords:
        if keyword in text_lower:
            return True

    return False


def is_image_type(mime_type):
    valid_image_mime_types = [
        "image/bmp",
        "image/cis-cod",
        "image/gif",
        "image/ief",
        "image/jpeg",
        "image/pipeg",
        "image/svg+xml",
        "image/tiff",
        "image/x-cmu-raster",
        "image/x-cmx",
        "image/x-icon",
        "image/x-portable-anymap",
        "image/x-portable-bitmap",
        "image/x-portable-graymap",
        "image/x-portable-pixmap",
        "image/x-rgb",
        "image/x-xbitmap",
        "image/x-xpixmap",
        "image/x-xwindowdump",
        "image/png",
        "image/webp",
    ]

    return mime_type in valid_image_mime_types



def chunk_split(text, max_chunk_length):
    # Split the text into phrases using regular expressions (assuming phrases end with '.', '!', or '?')
    phrases = re.split(r'(?<=[.!?])\s+', text)

    chunks = []
    current_chunk = ''
    
    for phrase in phrases:
        if len(current_chunk) + len(phrase) <= max_chunk_length:
            current_chunk += phrase + ' '
        else:
            chunks.append(current_chunk.strip())  # Remove trailing space
            current_chunk = phrase + ' '

    # Add the last chunk
    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks


def split_srt_text(srt_text, max_chunk_length=512):
    chunks = []
    current_chunk = {'text': '', 'start_time': '', 'end_time': ''}
    remember_start_time = ""
    remembet_end_time = ""
    
    for block_number, block in enumerate(srt_text.split('\n\n')):
        block = block.strip()  # Remove leading/trailing whitespace

        # Remove the lines with numbers using regex
        block = re.sub(r'^\d+\n', '', block, flags=re.MULTILINE)

        for line in block.split('\n'):
            if ' --> ' in line:
                # Parse time info
                start_time, end_time = line.split(' --> ')
                if remember_start_time == "":
                    remember_start_time = start_time.strip()[:-4]
                current_chunk['end_time'] = end_time.strip()[:-4]
            else:
                if len(line.strip()) > 512:
                    # devide the text into chunks of 512 characters
                    splitted_text = chunk_split(line.strip(), 512)
                    remembet_end_time = current_chunk['end_time']

                    for text in splitted_text:
                        current_chunk['text'] = text
                        current_chunk['start_time'] = remember_start_time
                        current_chunk['end_time'] = remembet_end_time
                        if text != splitted_text[-1]:
                            chunks.append(current_chunk)
                            current_chunk = {'text': '', 'start_time': '', 'end_time': ''}
                    
                    remember_start_time = ""
                    remembet_end_time = ""

                # Append lines to the 'text' field
                elif (len(current_chunk['text'].strip()) + len(line.strip()) + 1) <= max_chunk_length:
                    current_chunk['text'] += ' ' + line.strip()
                    
                    if (len(srt_text.split('\n\n')) - 1 == block_number):
                        current_chunk['start_time'] = remember_start_time
                        current_chunk['text'] = current_chunk['text']
                        chunks.append(current_chunk)
                        current_chunk = {'text': '', 'start_time': '', 'end_time': ''}
                        remember_start_time = ""
                    
                else:
                    current_chunk['start_time'] = remember_start_time
                    current_chunk['text'] = current_chunk['text']
                    chunks.append(current_chunk)
                    current_chunk = {'text': line.strip(), 'start_time': '', 'end_time': ''}
                    remember_start_time = ""

        # If the current chunk is longer than the max_chunk_length, add it to the list of chunks and start a new chunk
        # if len(current_chunk['text']) > max_chunk_length:
        

    # Convert chunks to a list of dictionaries
    merged_chunks = [{'text': chunk['text'], 'timeframe': f"{chunk['start_time']} --> {chunk['end_time']}"} for chunk in chunks]

    return merged_chunks



def filter_result(data, accuracy):
    return [item for item in data if item["_additional"]["distance"] <= accuracy]


def is_audio_type(mime_type):
    audio_mime_types = [
        "audio/mpeg",
        "audio/wav",
        "audio/mp3",
        "audio/mp4",
        "audio/ogg",
        "audio/aac",
        "audio/flac",
        "audio/x-ms-wma",
        "audio/vnd.rn-realaudio",
        "audio/webm",
        "audio/midi",
        "audio/x-aiff",
        "audio/x-m4a",
        "audio/x-ms-wax",
        "audio/x-ms-wvx",
    ]
    return mime_type in audio_mime_types


def is_file_type(mime_type):
    file_mime_types = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain",
        "application/zip",
        "application/x-rar-compressed",
        "application/x-tar",
        "application/gzip",
        "application/x-7z-compressed",
        "application/vnd.rar",
        "application/x-msdownload",  # Executable files
        "application/x-diskcopy",    # Disk image files
        "application/octet-stream",  # Binary files
    ]
    return mime_type in file_mime_types



def categorize_file(mimetype: str) -> str:
    # given the mime type
    # use the defined utils to find if the
    # file is an image, video or something else.
    is_image = is_image_type(mimetype)
    is_3d_related = is_3d_related_text(mimetype)
    is_youtube_video = is_youtube_video(mimetype)

    if is_image:
        return "image"
    elif is_3d_related:
        return "3d"
    elif is_youtube_video:
        return "youtube"
    elif is_audio_type:
        return "audio"
    




# delete a file from filesystem
def delete_file(output_path: str):
    try:

        # Attempt to delete the audio file
        os.remove(output_path)
        success=True
        message=f"File '{output_path}' successfully deleted."
    except FileNotFoundError:

        # Handle the case when the file doesn't exist and return an OperationResult object with success=False and the error message
        success=False
        message = f"File '{output_path}' not found. Unable to delete."
    except PermissionError:

        # Handle the case when there are permission issues and return an OperationResult object with success=False and the error message
        success=False
        message = f"Permission error: Unable to delete '{output_path}'."
    except Exception as e:

        # Handle any other unexpected exceptions and return an OperationResult object with success=False and the error message
        success=False
        message = f"Error occurred while deleting '{output_path}': {e}"

    return OperationResult(success=success, message=message)


def save_file(file, mime_type):
    print(mime_type)
    if mime_type=="application/pdf":
        save_path = "../assets/saved_files/files"
    elif mime_type=="audio/mpeg":
        save_path = "../assets/saved_files/audio"
    else:
        return None

    file_path = os.path.join(save_path, file.filename)
    file.save(file_path)

    return file_path



# transcribe youtube with whisper
def transcribe_audio(audio_file_path, mime_type):

    print("transcription start")


    # get the path, type, size of the file
    size = os.path.getsize(audio_file_path)

    class AudioInfo:
        def __init__(self, mime_type, size, text=None, timeframe=None, full_text=None):
            self.mime_type = mime_type
            self.size = size
            self.text = text
            self.timeframe = timeframe
            self.full_text = full_text

    audio = AudioInfo(mime_type, size)

    # Transcribe the audio using Whisper and handle any errors during transcription
    try:

        # Make request to openai to get the transcription of the audio file
        transcription = get_transcription(audio_file_path)

        print()
        print("printing trasncription object")
        print(transcription)
        print("done")
        print()

        transcription = split_srt_text(transcription)

        # audio.text = chunk_split(transcription["text"], 512)
        # audio.full_text = transcription["text"]

        print("printing audio object")

        text_list = []
        timeframe_list = []

        for item in transcription:
            text_list.append(item["text"]),
            timeframe_list.append(item["timeframe"])

        audio.text = text_list
        audio.timeframe = timeframe_list

            # print(item)
            # print()

            # print(item["text"])
            # print(item["timeframe"])

        print(audio.text)
        print(audio.timeframe)

        print("done")
        
        return audio
    except Exception as e:
        # Handle any unexpected exceptions during transcription and return an error message
        print(f"Transcription failed. Reason: {e}")
    # finally:
    #     # Delete the audio file and handle any errors during deletion
    #     delete_result = delete_file(audio_file_path)
    #     if not delete_result.success:
    #         print(f"Deletion failed. Reason: {delete_result.message}")


def extract_file_content(file_path):

    # load the file
    loader = UnstructuredFileLoader(file_path)
    documents = loader.load()
    documents_content = '\n'.join(doc.page_content for doc in documents)

    # split the text into chunks
    text_splitter = CharacterTextSplitter(
        separator="\n\n",
        chunk_size=1200,
        chunk_overlap=200,
        length_function=len,
    )
    chunks = text_splitter.split_text(documents_content)

    return chunks