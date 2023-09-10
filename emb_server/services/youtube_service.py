import os
import uuid
import io
import time

from pytube import YouTube
from pytube.exceptions import PytubeError

from exceptions_results import OperationResult, UnsupportedAudioFormatError

from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import urlparse, parse_qs

from services.openai_service import get_transcription, get_transcription2, transcribe_audio_ro

from weaviate import Client

import utils

import json

# download youtube video
def download_youtube_video(url, output_path, id: str):
    try:
        # setup youtube object
        youtube = YouTube(url)

        # get the audio stream
        audio_stream = youtube.streams.filter(only_audio=True).first()

        # If download is successful, check if the audio format is supported
        mime_type = audio_stream.mime_type
        if not utils.is_audio_type(mime_type):
            # If the audio format is not supported, raise an UnsupportedAudioFormatError
            raise UnsupportedAudioFormatError("Internal server error: Unsupported audio format from YouTube.")

        # If the audio format is supported, return the audio file path
        audio_file_path = audio_stream.download(output_path=output_path, filename=f"youtube_audio_{id}.mp3")
        return OperationResult(success=True, message="Successfully downloaded the audio file.", return_data=audio_file_path)
    except PytubeError as e:
        # Handle PytubeError and return an OperationResult object with success=False, the error message, and no return_data
        return OperationResult(success=False, message=f"Error during fetching the video stream: {e}")
    except UnsupportedAudioFormatError as e:
        # Handle the custom UnsupportedAudioFormatError and return an OperationResult object with success=False, the error message, and no return_data
        return OperationResult(success=False, message=str(e))
    except Exception as e:
        # Handle any other unexpected exceptions during download and return an OperationResult object with success=False, the error message, and no return_data
        return OperationResult(success=False, message=f"Error during download: {e}")



# youtube transcript setup
def extract_video_id(url):
    reutrn_data = None
    try:
        # Parse the URL
        query = urlparse(url)

        # Extract the video ID from the query parameters
        video_id = parse_qs(query.query).get('v')

        if video_id:
            # If the video ID is found, return it in an OperationResult object

            success=True
            message="Successfully extracted the video ID from the URL."
            reutrn_data=video_id[0]
        else:
            # If the video ID is not found, return an OperationResult object with success=False and the error message
            
            success=False
            message = "Video ID not found in the URL."
    except Exception as e:
        # Handle any unexpected exceptions during parsing and return an OperationResult object with success=False and the error message
        
        success=False
        message = f"Error occurred while parsing the URL: {e}"

    return OperationResult(success=success, message=message, return_data=reutrn_data)



# download youtube video
def download_youtube_video(url):
    extract_result = extract_video_id(url)
    if not extract_result.success:
        print(f"Video ID extraction failed. Reason: {extract_result.message}")
        return
    
    video_id = extract_result.return_data

    output_path_str = "../assets/saved_files/yt_videos"

    audio_file_path = None
    try:
        # setup youtube object
        youtube = YouTube(url)

        # get the audio stream
        audio_stream = youtube.streams.filter(only_audio=True).first()

        print("url")
        print(video_id)
        print(url)
        print(audio_stream)

        # download the audio file
        audio_file_path = audio_stream.download(output_path=output_path_str, filename=f"youtube_audio_{video_id}.mp3")

        success=True
        message="Successfully downloaded the audio file."
    except PytubeError as e:

        # Handle any PytubeError that might occur during fetching the video stream
        success=False
        message=f"Error during fetching the video stream: {e}"
    except Exception as e:

        # Handle any other unexpected exceptions during download
        success=False
        message=f"Error during download: {e}"

    return_data = {
        'path': audio_file_path,
        'stream': audio_stream
    }
    
    return OperationResult(success=success, message=message, return_data=return_data)


