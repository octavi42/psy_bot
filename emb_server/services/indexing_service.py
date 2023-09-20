import pandas as pd
from services import openai_service, youtube_service, file_service, weaviateService
from weaviate import Client

def indexing_save(client, saveClass, data):

    # tweak data capture
    if saveClass == "Youtube" or saveClass == "Audio":
        timeframe = data["timeframe"]

    # separate data in columns
    df = pd.DataFrame(data["data"], columns=["chunk"])
    # Now apply the embedding function to the dataframe
    df["embedding"] = df["chunk"].apply(openai_service.get_embedding)

    # uuid array definition
    object_uuids = []

    # Iterate the dataframe and add every row to the weaviate class
    for index, row in df.iterrows():
        # Extract the relevant information from the embedding_result
        data["data"] = row["chunk"]
        
        # tweak apply
        if saveClass == "Youtube" or saveClass == "Audio":
            data["timeframe"] = timeframe[index]

        object_uuid = client.data_object.create(
            data_object=data,
            class_name=saveClass,
            vector=row["embedding"]  # Use the extracted embedding vector
        )

        # append the uuid to the list
        object_uuids.append(object_uuid)

    return object_uuids