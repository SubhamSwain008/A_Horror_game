import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

mongo_uri=os.getenv("MONGO_URI")

try:
    client=MongoClient(mongo_uri)
    print("DB conncected")
except Exception as e:
    print(e)