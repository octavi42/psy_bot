import os
import time
import openai
import json
# import pandas as pd
from utils import utils
from flask_cors import CORS
from weaviate import Client
from dotenv import load_dotenv
from services import openai_service, youtube_service, file_service, weaviateService
from flask import Flask, jsonify, request


import io

from services import indexing_service

from utils.utils import split_srt_text

load_dotenv()

app = Flask("indexing-service")
app.config['UPLOAD_FOLDER'] = "upload"

CORS(app)


client = Client("http://localhost:8080")

print(client)


@app.route("/ping", methods=["GET"])
def ping():
    response = {"message": "pong!"}
    return jsonify(response)


# this route takes whole files
@app.route("/index-file", methods=["POST"])
def index_file():
    # take the file from the request and
    # put the mime type into a variable
    # take the chat id from the request to create the new weaiate class


    match = request.form["match"]
    sender = request.form["sender"]
    file = request.files["file"]


    # get the mime type of the file
    mime_type = file.content_type

    # save the file here "../assets/saved_files/yt_videos"
    file_path = utils.save_file(file, mime_type)


    if utils.is_file_type(mime_type):
        print("processing file...")
        category = "Data"

        # extract the content of the file
        chunks = utils.extract_file_content(file_path)

        # create the data model
        data = {
            "match": match,
            "sender": sender,
            "data": chunks,
            "type": "pdf"
        }

        # save the data to weaviate
        uuid = indexing_service.indexing_save(client=client, saveClass=category, data=data)



    if utils.is_audio_type(mime_type):
        print("processing audio...")
        category = "Audio"

        # transcribe audio
        audio = utils.transcribe_audio(file_path, mime_type)

        data = {
            "match": match,
            "sender": sender,
            "data": audio.text,
            "timeframe": audio.timeframe,
            "type": "audio"
        }

        # save the data to weaviate
        uuid = indexing_service.indexing_save(client=client, saveClass=category, data=data)


    return jsonify({
        "response": audio.text,
        "uuid": uuid
    })


@app.route("/index-url", methods=["POST"])
def index_url():

    match = request.get_json()["match"]
    sender = request.get_json()["sender"]
    url = request.get_json()["url"]
    category = "Youtube"

    print("match: ", match)
    print("sender: ", sender)
    print("url: ", url)

    # sleep for 5 seconds to let the file be saved
    time.sleep(5)

    print("woke up from sleep")

    return jsonify({
        "status": "success",
        "data": "data",
        "uuid": "uuid0001",
        "fileType": "Youtube"
    })

    # is_youtube_url = utils.is_youtube_video(url)
    # if is_youtube_url:
    #     print("In youtube if for processing it...")

    #     # get the youtube id
    #     youtube_id = youtube_service.extract_video_id(url).return_data

    #     # download the youtube video
    #     download_result = youtube_service.download_youtube_video(url)
        
    #     # transcribe audio
    #     audio_file_path = download_result.return_data['path']
    #     mime_type = download_result.return_data['stream'].mime_type
    #     audio = utils.transcribe_audio(audio_file_path, mime_type)

    # else:
    #     print("do normal page processing of the information")

    # data = {
    #     "yt_id": youtube_id,
    #     "match": match,
    #     "sender": sender,
    #     "data": audio.text,
    #     "timeframe": audio.timeframe,
    #     "type": "audio"
    # }

    # uuid = indexing_service.indexing_save(client=client, saveClass=category, data=data)
    
    # indexing_save(client, saveClass, match, sender, category, data, type):

    # embed every text and add it to the weaviate class.

    return jsonify({
        "data": "data",
        # "uuid": uuid
    })


@app.route("/index-qa", methods=["POST"])
def index_qa():
    match = request.get_json()["match"]
    sender = request.get_json()["sender"]
    question = request.get_json()["question"]
    answer = request.get_json()["answer"]
    question_category = request.get_json()["question_category"]
    category = "QA"

    data = {
        "match": match,
        "sender": sender,
        "category": question_category,
        "question": question,
        "answer": answer,
    }

    save_result = indexing_service.indexing_save(client=client, saveClass=category, data=data)

    return jsonify({
        "data": data,
        "result": save_result
    })


@app.route("/index-about", methods=["POST"])
def index_about():
    match = request.get_json()["match"]
    sender = request.get_json()["sender"]
    about_category = request.get_json()["about_category"]
    data = request.get_json()["data"]
    category = "About"

    data = {
        "match": match,
        "sender": sender,
        "category": about_category,
        "data": data,
    }

    save_result = indexing_service.indexing_save(client=client, saveClass=category, data=data)

    return jsonify({
        "data": data,
        "result": save_result
    })


@app.route("/search", methods=["POST"])
def search():
    print("got in request")
    # we get a search query from the request
    search_query = request.get_json()["search_query"]
    # chat_id: str = request.get_json()["chat_id"]
    # search_class = request.get_json()["search_class"]\
    
    # embed the search query
    search_query_embedding = openai_service.get_embedding(search_query)

    response = (
        client.query
        .get("Youtube", ["data", "timeframe", "yt_id"])
        .with_near_vector({
            "vector": search_query_embedding,
        })
        .with_limit(5)
        .with_additional(["distance"])
        .do()
    )

    # capitalized_chat_id = chat_id.capitalize()
    
    print(response)


    data = response["data"]["Get"]["Youtube"]

    # filter the data in terms of accuracy
    filtered_data = utils.filter_result(data, 0.25)


    return jsonify({
        "data": filtered_data
    })


@app.route("/check-schema", methods=["GET"])
def check_schema():
    # check if the schema is already created
    # if not create it
    # if yes, do nothing
    schema = client.schema.get()
    if schema == {}:
        print("schema is empty")
        # create the schema
        schema = weaviateService.create_schema(client)
        print("schema created")
    else:
        print("schema is not empty")
        print(schema)

    return jsonify({
        "schema": schema
    })



@app.route("/create-schema", methods=["GET"])
def create_schema():
    schema = weaviateService.createSchema(client)
    return jsonify({
        "schema": schema
    })


@app.route("/delete-schema", methods=["GET"])
def delete_schema():
    schema = weaviateService.deleteSchema(client)
    return jsonify({
        "schema": schema
    })

@app.route("/check-all-objects", methods=["GET"])
def check_all_objects():
    query = (
        # client.query.get("Youtube", ["match", "data", "timeframe"])
        client.query.get("Audio", ["match", "data", "timeframe"])
        # client.query.get("Data", ["match", "data"])
        # Optionally retrieve the vector embedding by adding `vector` to the _additional fields
        # .with_additional(["id"])
        # .with_limit(20)
    )

    print(query.do())

    return jsonify({
        "query": query.do()
    })


@app.route("/delete-object", methods=["POST"])
def delete_object():
    delete_class = request.get_json()["class"]
    delete_from_sender = request.get_json()["sender"]
    id = request.get_json()["id"]


    if delete_class == "null":
        return jsonify({
            "status": "error",
            "message": "No class was provided"
        })
    
    
    if delete_from_sender != "null" and id == "null":
        result = client.batch.delete_objects(
            class_name=delete_class,
            where={
                'path': ['match'],
                'operator': 'Equal',
                'valueString': delete_from_sender
            }
        )

        return jsonify({
            "status": "success",
            "result": result
        })
    
    
    if delete_from_sender == "null" and id != "null":
        result = client.batch.delete_objects(
            class_name=delete_class,
            uuid=id
        )

        return jsonify({
            "status": "success",
            "result": result
        })


    return jsonify({
        "status": "error",
        "result": "No class was provided"
    })


def test_youtube_transcirbe():
    url = "https://www.youtube.com/watch?v=5ftHdsmf2C0&ab_channel=CreatedTech"
    is_youtube_url = utils.is_youtube_video(url)

    if is_youtube_url:
        print("In youtube if for processing it...")

        print(url)

        result = youtube_service.transcribe_youtube(url, "../assets/saved_files/yt_videos")
    else:
        print("do normal page processing of the information")

    print("done transcribing")


if __name__ == "__main__":
    app.run(port=5050, debug=True)

    # chat_id = request.get_json()["chat_id"]
    # print("got chat_id: ", chat_id)

    # indexing_service.indexing_save(result, chat_id, client)