import openai

import whisper

# from pydub import AudioSegment

from transformers import WhisperProcessor, WhisperForConditionalGeneration
# from datasets import Audio, load_dataset
import torch

# import librosa
import numpy as np

import os
from dotenv import load_dotenv

def get_embedding(text: str, model="text-embedding-ada-002"):
    """Get embedding from text using text-embedding-ada-002 model."""
    return openai.Embedding.create(input=[text], model=model)['data'][0]['embedding']


def get_transcription(audio_file_path, model="whisper-1"):
    print("Getting transcription from openai...")

    load_dotenv()

    # file = open("services/youtube_audio_UkVvBQUABOw.mp3", 'rb')

    openai.api_key = os.getenv('OPENAI_API_KEY')

    # use openai whisper api to get transcription of the audio file

    # response = openai.Audio.transcribe(
    #     api_key=os.getenv('OPENAI_API_KEY'),
    #     model=model,
    #     file=file
    # )

    # response = openai.Audio.transcribe(
    #     file = audio_file_path,
    #     model = "whisper-1",
    #     response_format="text",
    #     language="ro"
    # )

    with open(audio_file_path, "rb") as audio_file:
        response = openai.Audio.transcribe(
            file=audio_file,
            model=model,
            response_format="srt",
            language="ro",
            temperature=0.5,
        )

    print("response")
    print(response)
    print()

    return response



def get_transcription2( filePath ):
    # audio_file_path = "youtube_audio_0ON9qNltoUU.wav"


    model = whisper.load_model("large-v2")
    # audio = "services/youtube_audio_UkVvBQUABOw.mp3"
    result = model.transcribe(filePath, language="ro", fp16=False)
    print(result["text"])

    return result



# def is_valid_audio(audio_file_path):
#     try:
#         audio = AudioSegment.from_file(audio_file_path)
#         return True
#     except Exception as e:
#         print(f"Invalid audio file: {e}")
#         return False
    

def transcribe_audio_ro(audio_file_path):
    audio_file_path = "services/youtube_audio_UkVvBQUABOw.mp3"

    # Check if the audio file is valid before processing
    if not is_valid_audio(audio_file_path):
        return "Invalid audio file."

    # Load the Whisper processor and model
    processor = WhisperProcessor.from_pretrained("gigant/whisper-medium-romanian")
    model = WhisperForConditionalGeneration.from_pretrained("gigant/whisper-medium-romanian")

    # Read the audio file as bytes
    with open(audio_file_path, "rb") as audio_file:
        audio_data = audio_file.read()

    print("Loaded audio data:", audio_data[:100])  # Print the first 100 bytes of audio data

    # Transcribe the audio
    input_features = processor(audio_data, return_tensors="pt", sampling_rate=16_000).input_features
    print("Input features:", input_features)  # Print the input features

    predicted_ids = model.generate(input_features, max_length=448)
    print("Predicted IDs:", predicted_ids)  # Print the predicted IDs

    transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)

    # Print or return the transcription
    return transcription


def gptTune(response):
    messages =  [   {"role": "system", "content": "you are a professional text processing engineer"},
                    {"role": "user", "content": f"{response} \n\n filter the text so you keep the important text, merge the data so I don't have such short phrases and the format should be the same: the count, the timeframe from what minute to what minute and the text, make sure one text is not longer than 512 characters"}
                ]

    chat = openai.ChatCompletion.create(
        model="gpt-3.5-turbo", messages=messages
    )


    result = chat.choices[0].message.contentv

    return result