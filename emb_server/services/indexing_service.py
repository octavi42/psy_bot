import pandas as pd
from services import openai_service, youtube_service, file_service, weaviateService
from weaviate import Client


def indexing_save(client, saveClass, data):

    # tweak data capture
    if saveClass == "Youtube" or saveClass == "Audio":
        timeframe = data["timeframe"]

    # if "timeframe" in data and data["timeframe"]:
    #     print("Timeframe is present and not empty:", data["timeframe"])
    # else:
    #     print("No timeframe or timeframe is empty")

    # for key, value in data.items():
    #     print(f"{key}: {value}")


    # separate data in columns
    df = pd.DataFrame(data["data"], columns=["chunk"])
    # Now apply the embedding function to the dataframe
    df["embedding"] = df["chunk"].apply(openai_service.get_embedding)


    # # Iterate the dataframe and add every row to the weaviate class
    for index, row in df.iterrows():
        # embedding_result = openai_service.get_embedding(row["chunk"])

        # Extract the relevant information from the embedding_result
        data["data"] = row["chunk"]
        
        # tweak apply
        if saveClass == "Youtube" or saveClass == "Audio":
            data["timeframe"] = timeframe[index]

        uuid = client.data_object.create(
            data_object=data,
            class_name=saveClass,
            vector=row["embedding"]  # Use the extracted embedding vector
        )

    return uuid