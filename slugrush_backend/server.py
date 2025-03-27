from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.responses import JSONResponse
from slugrush_backend.html_scraper import FOScraper 
import json

MOCK_DB_PATH = "mock_database/crowd_data.json"

app = FastAPI()

# SQL DB Table Schema
class CrowdData(BaseModel):
    id: int
    day_of_week: str
    hour: int
    occupancy_count: int
    timestamp: str

# load data from mockdb.json
def load_mock_data():
    with open(MOCK_DB_PATH, "r") as file:
        return json.load(file)

# save data to mockdb.json
def save_mock_data(data):
    with open(MOCK_DB_PATH, "w") as file:
        json.dump(data, file, indent=4)

# GET endpoint to fetch gym data (crowd data from mockdb)
@app.get("/gym/crowd", response_model=List[CrowdData])
def get_gym_data():
    gym_data = load_mock_data()
    return gym_data

# POST endpoint to add data to the mockdb (update previous week with recent date)
@app.post("/gym/crowd", response_model=CrowdData)
def add_gym_data(crowd_data: CrowdData):
    gym_data = load_mock_data()
    new_entry = crowd_data  # Convert Pydantic model to dictionary
    gym_data.append(new_entry)
    save_mock_data(gym_data)
    return {"message": "Data added successfully!", "data": new_entry}

# GET endpoint for returning parsed data entry (scraped HTML content)
@app.get("/gym/scrape")
def get_occupancy():
    scraper = FOScraper()
    try:
        data = scraper.scrape_html()
        return JSONResponse(data)
    except Exception as e:
        return JSONResponse({"error": str(e)}), 500

