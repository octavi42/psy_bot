import pandas as pd
from services import openai_service, youtube_service, file_service, weaviateService
from weaviate import Client


def indexing_save(client, saveClass, data, match, sender, category, type):
    # Assuming data is a list of values
    print("result:")
    print(data)

    df = pd.DataFrame(data, columns=["chunk"])

    print("df:")
    print(df)

    # Now apply the embedding function to the dataframe
    df["embedding"] = df["chunk"].apply(openai_service.get_embedding)

    # Iterate the dataframe and add every row to the weaviate class
    for index, row in df.iterrows():
        data_object = {
            "match": match,
            "sender": sender,
            "category": category,
            "data": row["chunk"],
            "type": type
        }
        client.data_object.create(
            data_object=data_object,
            class_name=saveClass,
            vector=row["embedding"]
        )