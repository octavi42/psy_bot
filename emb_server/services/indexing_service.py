import pandas as pd
from services import openai_service, youtube_service, file_service, weaviateService
from weaviate import Client


def indexing_save(client, saveClass, data):

    if saveClass == "Youtube":

        print(data["text"])

        df = pd.DataFrame(data["text"], columns=["chunk"])

        print("df:")
        print(df)

        # Now apply the embedding function to the dataframe
        df["embedding"] = df["chunk"].apply(openai_service.get_embedding)

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

        # Iterate the dataframe and add every row to the weaviate class
        for index, row in df.iterrows():
            # embedding_result = openai_service.get_embedding(row["chunk"])

            # Extract the relevant information from the embedding_result

            data_object = {
                "yt_id": data["yt_id"],
                "match": data["match"],
                "sender": data["sender"],
                "data": row["chunk"],
                "timeframe": data["timeframe"],
                "type": data["type"]
            }
            client.data_object.create(
                data_object=data_object,
                class_name=saveClass,
                vector=row["embedding"]  # Use the extracted embedding vector
            )