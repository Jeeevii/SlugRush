from fastapi import FastAPI
from fastapi.responses import JSONResponse
from html_scraper import FOScraper
from pydantic import BaseModel

MOCK_DB_PATH = "mock_database/crowd_week_data.json"

app = FastAPI()

class Crowd(BaseModel):
    message: str

@app.get("/")
async def root():
    return {
        "message": "SlugRush | Backend running on FastAPI on port 8000",
        "routes": {
            "/docs": "FastAPI's docs with clear and visual examples",
            "/get/count": "GETS formatted count of Fitness Center",
            "/get/daily": "GETS all daily counts currently getting collected",
            "/get/weekly": "GETS previous week's counts",
            "/post/crowd": "POSTS given count into daily table"
        }
    }

# GET endpoint to return scraped count data
@app.get("/get/count")
def get_count():
    scraper = FOScraper()
    try:
        data = scraper.get_hour_count()
        return JSONResponse(content=data)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.get("/get/daily")
def get_daily():

    return JSONResponse(content={
        "status": "success",
        "message": "GET daily route currently under development",
        "data": []
    })


@app.get("/get/weekly")
def get_weekly():

    return JSONResponse(content={
        "status": "success",
        "message": "GET weekly route currently under development",
        "data": []
    })

@app.post("/post/crowd/")
def post_crowd(crowd: Crowd):
    msg = crowd.message

    return {
        "status": "success",
        "message": "POST crowd count currently under development",
        "crowd": msg
    }


# internal testing 
# if __name__ == "__main__":


