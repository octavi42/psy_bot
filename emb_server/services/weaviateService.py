from weaviate import Client


def contains(list, isInList):
    for x in list:
        if isInList(x):
            return True
    return False


def getOrCreateClass(client: Client, className: str):
    try:
        schema = client.schema.get()
        if contains(schema["classes"], lambda x: x["class"] == className):
            print("Class already exists")
            return
        else:
            class_obj = {"class": className}
            client.schema.create_class(class_obj)
    except Exception as e:
        print(e)
        print("Error in getOrCreateClass")


def createSchema(client: Client):
    schema = {
        "classes": [
            {
                "class": "About",
                "description": "About the service provider",
                "properties": [
                    {
                        "dataType": ["text"],
                        "name": "match"
                    },
                    {
                        "dataType": ["text"],
                        "name": "sender"
                    },
                    {
                        "dataType": ["text"],
                        "name": "category"
                    },
                    {
                        "dataType": ["text"],
                        "name": "data"
                    }
                ]
            },
            {
                "class": "Database",
                "description": "Database content",
                "properties": [
                    {
                        "dataType": ["text"],
                        "name": "match"
                    },
                    {
                        "dataType": ["text"],
                        "name": "sender"
                    },
                    {
                        "dataType": ["text"],
                        "name": "category"
                    },
                    {
                        "dataType": ["text"],
                        "name": "data"
                    },
                ]
            },
            {
                "class": "Data",
                "description": "Costum entered data",
                "properties": [
                    {
                        "dataType": ["text"],
                        "name": "match"
                    },
                    {
                        "dataType": ["text"],
                        "name": "sender"
                    },
                    {
                        "dataType": ["text"],
                        "name": "category"
                    },
                    {
                        "dataType": ["text"],
                        "name": "data"
                    },
                    {
                        "dataType": ["text"],
                        "name": "type"
                    },
                ]
            },
            {
                "class": "QA",
                "description": "Questions and answers",
                "properties": [
                    {
                        "dataType": ["text"],
                        "name": "match"
                    },
                    {
                        "dataType": ["text"],
                        "name": "sender"
                    },
                    {
                        "dataType": ["text"],
                        "name": "category"
                    },
                    {
                        "dataType": ["text"],
                        "name": "question"
                    },
                    {
                        "dataType": ["text"],
                        "name": "answer"
                    }
                ]
            }
        ]
    }
    
    client.schema.create(schema)

    schema = client.schema.get()
    
    return schema
    


# deleting the whole schema
def deleteSchema(client: Client):
    client.schema.delete_all()
    
    schema = client.schema.get()
    
    return schema


# deleting a class
def deleteClass(client: Client, className: str):
    client.schema.delete_class(className)
    
    schema = client.schema.get()
    
    return schema