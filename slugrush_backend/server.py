from fastapi import FastAPI
from pydantic import BaseModel
import json
from typing import List

app = FastAPI()

# Path to the mock DB file
MOCK_DB_PATH = "mock_database/crowd_data.json"

# Function to load data from mockdb.json
def load_mock_data():
    with open(MOCK_DB_PATH, "r") as file:
        return json.load(file)

# Function to save data to mockdb.json (optional, if you want to mock data updates)
def save_mock_data(data):
    with open(MOCK_DB_PATH, "w") as file:
        json.dump(data, file)

# Endpoint to get gym data (crowd data from mockdb)
@app.get("/gym/crowd")
def get_gym_data():
    gym_data = load_mock_data()
    return {"gym_data": gym_data}

# Example endpoint to add data to the mockdb (for testing)
@app.post("/gym/crowd")
def add_gym_data(crowd_count: int, timestamp: str, date: str):
    gym_data = load_mock_data()
    new_entry = {
        "id": len(gym_data) + 1,
        "timestamp": timestamp,
        "crowd_count": crowd_count,
        "date": date
    }
    gym_data.append(new_entry)
    save_mock_data(gym_data)
    return {"message": "Data added successfully!", "data": new_entry}
