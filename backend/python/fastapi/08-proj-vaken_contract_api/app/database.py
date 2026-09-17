from config import MONGODB_URI
from pymongo import MongoClient

client = MongoClient(MONGODB_URI)
db = client["mydb"]

contracts_collection = db["contracts"]
analysis_collection = db["analysis"]


def init_db():
    contracts_collection.create_index("filename", unique=True)
    analysis_collection.create_index("contract_id")
