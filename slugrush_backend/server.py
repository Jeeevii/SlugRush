from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from typing import Dict
from web_scraper import Scraper
from scheduler import Scheduler
from database import Database
from dotenv import load_dotenv

import json
import uvicorn
import os
import json
load_dotenv()

FRONTEND_URL = os.environ.get("FRONTEND_URL")
MOBILE_URL = os.environ.get("MOBILE_URL")
BACKEND_PORT = int(os.environ.get("BACKEND_PORT", 8000))
SLUGRUSH_API_KEY = os.getenv("SLUGRUSH_API_KEY")
print(f"Allowed Origin: {FRONTEND_URL}")

# MOCK_DB_PATH = "mock_database/crowd_week_data.json"
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["*"], 
    allow_origins=[FRONTEND_URL, MOBILE_URL], 
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["Authorization", "Content-Type", "slugrush-api-key"],
)
scheduler = Scheduler() # runs background scheduler seperate thread
db = Database()

# updated startup and shutdown with FastAPI lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    # db.start() # only testing
    scheduler.start_jobs()
    yield # when server shutdowns down (manual ctrl + c)
    # db.exit() # only testing
    scheduler.stop_jobs()

app.router.lifespan_context = lifespan

# route 
@app.get("/")
async def root():
    return {
        "message": "Backend is healthy",
    }


# GET endpoint - scrapes gym page when called and returns jsonified dict
@app.get("/get/count")
def get_count(slugrush_api_key: str = Header(None)) -> Dict:
    if slugrush_api_key != SLUGRUSH_API_KEY:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid API Key")
    scraper = Scraper()
    try:
        data = scraper.gym_scrape()
        return json.loads(data)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
    
# GET endpoint - queries database and returns all rows with current day crowd_counts - NEEDED FOR GRAPHING DAILY VIEW
@app.get("/get/daily")
def get_daily(slugrush_api_key: str = Header(None)) -> Dict:
    if slugrush_api_key != SLUGRUSH_API_KEY:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid API Key")
    msg = db.get_daily_query()
    return msg

# GET endpoint - queries database and returns all of previous weeks (1-7) crowd_count - NEEDED FOR GRAPHING WEEKLY VIEW
@app.get("/get/weekly")
def get_weekly(slugrush_api_key: str = Header(None)) -> list:
    if slugrush_api_key != SLUGRUSH_API_KEY:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid API Key")
    msg = db.get_weekly_query()
    return msg

# internal start up
if __name__ == "__main__":
    uvicorn.run("server:app", host="localhost", port=BACKEND_PORT, reload=True)

