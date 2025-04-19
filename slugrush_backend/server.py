from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import requests
from dotenv import load_dotenv

import os
load_dotenv()

# Constants
BACKEND_URL = os.getenv('BACKEND_URL')

app = FastAPI()

# 👇 This is where the magic happens
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] for wild west (not prod safe)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def root():
    return {
        "message": "SlugRush Proxy Server Running",
        "routes": {
            "/get/count": "Proxy to hosted /get/count",
            "/get/daily": "Proxy to hosted /get/daily",
            "/get/weekly": "Proxy to hosted /get/weekly",
        }
    }


@app.get("/get/count")
def proxy_get_count():
    return proxy_request("/get/count")


@app.get("/get/daily")
def proxy_get_daily():
    return proxy_request("/get/daily")


@app.get("/get/weekly")
def proxy_get_weekly():
    return proxy_request("/get/weekly")


def proxy_request(endpoint: str):
    try:
        res = requests.get(f"{BACKEND_URL}{endpoint}")
        res.raise_for_status()
        print(f"[PROXY] GET {endpoint} → {res.status_code}")
        return res.json()
    except Exception as e:
        print(f"[PROXY] GET {endpoint} → {res.status_code}")
        return JSONResponse(content={"error": str(e)}, status_code=500)


if __name__ == "__main__":
    import uvicorn
    PORT = int(os.environ.get("PORT", 8000))
    uvicorn.run("server:app", host="0.0.0.0", port=PORT, reload=True)
