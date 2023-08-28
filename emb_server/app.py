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
    file = request.files["file"]

    # get the mime type of the file
    mime_type = file.content_type

    chat_id = request.form["chat_id"]
    print("got chat_id: ", chat_id)
    # check the file if it is audio
    # or if it is somethig else ( will assume text for now )
    result: list[str] = []
    if utils.is_audio_type(mime_type):
        print("processing audio...")
        result: list[str] = file_service.process_audio_file(file)
    else:
        print("processing text...")
        # result: list[str] = file_service.process_text_file(file)

    try:
        # embed every text and add it to the weaviate class with the chatId.
        indexing_service.indexing_save(result, chat_id, client)
        # print("dajh")
    except Exception as e:
        print(e)
        return jsonify({
            "response": "error"
        })

    return jsonify({
        "response": "ok"
    })


@app.route("/index-url", methods=["POST"])
def index_url():

    url = request.get_json()["url"]
    match = request.get_json()["match"]
    sender = request.get_json()["sender"]
    category = "Youtube"

    print()
    print("match that I got in the server:")
    print(match)

    is_youtube_url = utils.is_youtube_video(url)

    if is_youtube_url:
        print("In youtube if for processing it...")

        print(url)

        result = youtube_service.transcribe_youtube(url, "../assets/saved_files/yt_videos")

    else:
        print("do normal page processing of the information")

    print("done transcribing")

    # {
    #     "dataType": ["text"],
    #     "name": "yt_id"
    # },
    # {
    #     "dataType": ["text"],
    #     "name": "match"
    # },
    # {
    #     "dataType": ["text"],
    #     "name": "sender"
    # },
    # {
    #     "dataType": ["text"],
    #     "name": "data"
    # },
    # {
    #     "dataType": ["text"],
    #     "name": "timeframe"
    # },
    # {
    #     "dataType": ["text"],
    #     "name": "type"
    # },

    data = {
        "yt_id": youtube_service.extract_video_id(url),
        "match": match,
        "sender": sender,
        "text": result.text,
        "timeframe": result.timeframe,
        "type": "audio"
    }

    indexing_service.indexing_save(client=client, saveClass=category, data=data)
    
    # indexing_save(client, saveClass, match, sender, category, data, type):

    # embed every text and add it to the weaviate class.

    return jsonify({
        "data": result.full_text
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
        .get("Data", ["data"])
        .with_near_vector({
            "vector": search_query_embedding,
        })
        .with_limit(5)
        .with_additional(["distance"])
        .do()
    )

    # capitalized_chat_id = chat_id.capitalize()
    
    print(response)


    data = response["data"]["Get"]["Data"]

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



@app.route("/command", methods=["GET"])
def command():
    text = """
    1
    00:00:00,000 --> 00:00:22,000
    De-a lungul timpului, Gerald a adus denumărate îmbunătățiri și noutăți acestui training, prin descoperirile și noutățile pe care le-a avut atât ca hipnoterapeut, cât și ca trener în hipnoză, de-a lungul întregii sale experiențe, de-a lungul întregii sale vieți. În urma absolvirea acestui training, am devenit hipnoterapeut certificat, atât de către Omni Hypnoze, cât și către NGH, Alianța Națională a Hipnotiștilor din Statele Unite. fiecare problemă are o cauză, iar aceasta este de cel mai multe fiecare problemă are o cauză, iar aceasta este de cel mai multe De-a lungul timpului, Gerald a adus denumărate îmbunătățiri și noutăți acestui training, prin descoperirile și noutățile pe care le-a avut atât ca hipnoterapeut, cât și ca trener în hipnoză, de-a lungul întregii sale experiențe, de-a lungul întregii sale vieți. În urma absolvirea acestui training, am devenit hipnoterapeut certificat, atât de către Omni Hypnoze, cât și către NGH, Alianța Națională a Hipnotiștilor din Statele Unite. fiecare problemă are o cauză, iar aceasta este de cel mai multe fiecare problemă are o cauză, iar aceasta este de cel mai multe 

    2
    00:00:22,000 --> 00:00:27,000
    de mintea umană. Încă de foarte devreme am început să caut cât mai multe informații

    3
    00:00:27,000 --> 00:00:31,000
    legate de această forță interioră, de cum o putem dezvolta și în bunătății.

    4
    00:00:31,000 --> 00:00:36,000
    De-a lungul timpului am găsit inenumărate metode de dezvoltare personală,

    5
    00:00:36,000 --> 00:00:43,000
    iar hipnoza a apărut în mod constant și s-a dovedit a fi extrem de eficientă, rapidă și ușor de folosit.

    6
    00:00:43,000 --> 00:00:48,000
    Acest lucru m-a ajutat să realizez faptul că hipnoza este calea pe care vreau să o urmez,

    7
    00:00:48,000 --> 00:00:52,000
    astfel că mi-am focalizat și mai mult căutările în această direcție.

    8
    00:00:53,000 --> 00:00:59,000
    Cu cât am studiat și cercetat mai mult, cu atât mai mult mi-am dat seama că cel mai important lucru pe care îl pot face,

    9
    00:00:59,000 --> 00:01:03,000
    cel mai bun pas pe care îl pot face este acela de a învăța în mod practic, în mod direct,

    10
    00:01:03,000 --> 00:01:09,000
    de la cineva care are experiență, de la cineva care trăiește, care știe cu adevărat ce înseamnă hipnoza.

    11
    00:01:10,000 --> 00:01:14,000
    Am vrut să învăț de la cel mai bun, astfel că am plecat în Statele Unite, în Florida,

    12
    00:01:14,000 --> 00:01:20,000
    unde am urmat cursurile școlii de hipnoză Omni Hypnosis Training Center, condusă de către Gerald Kine.

    13
    00:01:21,000 --> 00:01:27,000
    Cu peste 50 de ani de experiență în domeniu, Gerald Kine este cel mai bun trener de hipnoza la nivel mondial,

    14
    00:01:27,000 --> 00:01:31,000
    la ora actuală, având mii de elevi din toate colțurile lumii.

    15
    00:01:33,000 --> 00:01:37,000
    Gerald Kine a început să învețe și să practice hipnoza încă din fragedă copilărie,

    16
    00:01:37,000 --> 00:01:41,000
    avându-l ca profesor, ca mentor pe celebrul Dave Ellman,

    17
    00:01:41,000 --> 00:01:46,000
    ce are un prestigiu de legenda în domeniul hipnozei, având chiar și o tehnică ce-i poartă numele.

    18
    00:01:47,000 --> 00:01:53,000
    Prelund de la acesta informațiile și experiența s-a subformat cursului pe care Ellman l-a predat,

    19
    00:01:53,000 --> 00:01:58,000
    Gerald Kine a pus bazele școlii Omni Hypnosis Training Center.

    20
    00:01:59,000 --> 00:02:03,000
    De-a lungul timpului, Gerald a adus denumărate îmbunătățiri și noutăți acestui training,

    21
    00:02:04,000 --> 00:02:10,000
    prin descoperirile și noutățile pe care le-a avut atât ca hipnoterapeut, cât și ca trener în hipnoză,

    22
    00:02:10,000 --> 00:02:14,000
    de-a lungul întregii sale experiențe, de-a lungul întregii sale vieți.

    23
    00:02:15,000 --> 00:02:19,000
    În urma absolvirea acestui training, am devenit hipnoterapeut certificat,

    24
    00:02:19,000 --> 00:02:25,000
    atât de către Omni Hypnoze, cât și către NGH, Alianța Națională a Hipnotiștilor din Statele Unite.

    25
    00:02:26,000 --> 00:02:32,000
    Apoi am plecat în Asia, unde am practicat intens timp de 2 ani de zile cu clienți din întreaga lume.

    26
    00:02:34,000 --> 00:02:36,000
    Tot timpul am vrut să învăț mai mult, să știu mai mult,

    27
    00:02:36,000 --> 00:02:40,000
    am vrut să înțeleg cât mai bine ce înseamnă hipnoza, din cât mai multe perspective.

    28
    00:02:40,000 --> 00:02:46,000
    Astfel că am plecat la Londra, unde am urmat un curs de hipnoză de scenă predat de către Jerry Valle și Tommy V.

    29
    00:02:48,000 --> 00:02:55,000
    Cu cât am înțeles mai mult ce înseamnă hipnoza, cu cât am realizat cât de puternică poate fi atunci când este aplicată,

    30
    00:02:55,000 --> 00:03:02,000
    când este realizată în cunoștință de cauză, cu cât am văzut rezultatele extraordinare pe care le poate avea

    31
    00:03:02,000 --> 00:03:07,000
    atunci când știi ce se poate face, când, cum se face,

    32
    00:03:07,000 --> 00:03:14,000
    cu atât mai mult mi-am dat seama că doresc să împărtășesc și altora această cunoaștere, această știință a hipnozei.

    33
    00:03:15,000 --> 00:03:22,000
    Astfel că am urmat două cursuri de trener în hipnoză, unul oferit de către NGA și predat de către Ron Eslinger,

    34
    00:03:22,000 --> 00:03:32,000
    iar al doilea curs, al doilea training de trener în hipnoză, a fost cel oferit de către Omni Hypnosis Training Center și predat chiar de către Gerald Kain.

    35
    00:03:32,000 --> 00:03:42,000
    Iar în prezent sunt treneri certificate atât de către Omni, cât și de către NGH și am deschis reprezentanțe oficiale a acestor organizații în România.

    36
    00:03:43,000 --> 00:03:49,000
    De asemenea, împreună cu alți colegi, am pus bazele și am înființat Asociația Rămână de Hipnoză,

    37
    00:03:50,000 --> 00:03:57,000
    ce are ca scop promovarea și dezvoltarea hipnozei și hipnoterapiei în România, sub toate formele și aspectele sale.

    38
    00:03:58,000 --> 00:04:06,000
    Fiecare efect are o cauză, fiecare problemă are o cauză, iar aceasta este de cel mai multe ori de natură emoțională.

    39
    00:04:07,000 --> 00:04:13,000
    Hipnoza lucrează în mod direct la acest nivel subconștient al ființei, lucrează cu acest aspect emoțional,

    40
    00:04:13,000 --> 00:04:21,000
    iar aceasta o face să fie extrem de eficientă, o face să ducă către rezultate ce uneori îl părea chiar miraculoase.

    41
    00:04:22,000 --> 00:04:27,000
    Fie că vreți să învățați hipnoza pentru a vă dezvolta personal și a vă bucura de astfel de rezultate,

    42
    00:04:27,000 --> 00:04:30,000
    De-a lungul timpului, Gerald a adus denumărate îmbunătățiri și noutăți acestui training, prin descoperirile și noutățile pe care le-a avut atât ca hipnoterapeut, cât și ca trener în hipnoză, de-a lungul întregii sale experiențe, de-a lungul întregii sale vieți. În urma absolvirea acestui training, am devenit hipnoterapeut certificat, atât de către Omni Hypnoze, cât și către NGH, Alianța Națională a Hipnotiștilor din Statele Unite. fiecare problemă are o cauză, iar aceasta este de cel mai multe fiecare problemă are o cauză, iar aceasta este de cel mai multe De-a lungul timpului, Gerald a adus denumărate îmbunătățiri și noutăți acestui training, prin descoperirile și noutățile pe care le-a avut atât ca hipnoterapeut, cât și ca trener în hipnoză, de-a lungul întregii sale experiențe, de-a lungul întregii sale vieți. În urma absolvirea acestui training, am devenit hipnoterapeut certificat, atât de către Omni Hypnoze, cât și către NGH, Alianța Națională a Hipnotiștilor din Statele Unite. fiecare problemă are o cauză, iar aceasta este de cel mai multe fiecare problemă are o cauză, iar aceasta este de cel mai multe 

    43
    00:04:31,000 --> 00:04:35,000
    a urma un curs de tradiție al celei mai renumite școli de hipnoză

    44
    00:04:35,000 --> 00:04:39,000
    este primul și cel mai important pas pe care îl puteți face în această direcție.

    45
    00:04:40,000 --> 00:04:44,000
    Aveți acum oportunitatea de a învăța hipnoza chiar și în România.

    46
    00:04:44,000 --> 00:04:52,000
    Aveți oportunitatea de a învăța și a aplica în mod practic toate aceste metode și tehnici de dezvoltare personală

    47
    00:04:53,000 --> 00:04:58,000
    ce duc către un echilibru interior, către o viață mai bună.

    48
    00:04:58,000 --> 00:05:00,000
    De-a lungul timpului, Gerald a adus denumărate îmbunătățiri și noutăți acestui training, prin descoperirile și noutățile pe care le-a avut atât ca hipnoterapeut, cât și ca trener în hipnoză, de-a lungul întregii sale experiențe, de-a lungul întregii sale vieți. În urma absolvirea acestui training, am devenit hipnoterapeut certificat, atât de către Omni Hypnoze, cât și către NGH, Alianța Națională a Hipnotiștilor din Statele Unite. fiecare problemă are o cauză, iar aceasta este de cel mai multe fiecare problemă are o cauză, iar aceasta este de cel mai multe De-a lungul timpului, Gerald a adus denumărate îmbunătățiri și noutăți acestui training, prin descoperirile și noutățile pe care le-a avut atât ca hipnoterapeut, cât și ca trener în hipnoză, de-a lungul întregii sale experiențe, de-a lungul întregii sale vieți. În urma absolvirea acestui training, am devenit hipnoterapeut certificat, atât de către Omni Hypnoze, cât și către NGH, Alianța Națională a Hipnotiștilor din Statele Unite. fiecare problemă are o cauză, iar aceasta este de cel mai multe fiecare problemă are o cauză, iar aceasta este de cel mai multe 
    """
    
    return jsonify({
        "response": split_srt_text(text)
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
        client.query.get("Youtube", ["match", "data"])
        # client.query.get("Data", ["data"])
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
    id = request.get_json()["id"]
    print()
    print("id")
    print(id)
    result = client.batch.delete_objects(
        class_name='Data',
        where={
            'path': ['match'],
            'operator': 'Equal',
            'valueString': id
        }
    )

    return jsonify({
        "status": "success",
        "result": result
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