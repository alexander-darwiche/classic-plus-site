from fastapi import FastAPI
from app.routers import items, survey
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()  # only once!

# Correct CORS setup
origins = [
    "https://classic-plus-site-frontend.onrender.com",  # remove the trailing slash
    "http://localhost:3000",  # optional for local dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(items.router)
app.include_router(survey.router)

@app.get("/")
def root():
    return {"message": "Hello from FastAPI"}

# Mount static directory for serving map files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/map")
def get_map():
    # Serve a map image from /static/map.jpg
    return FileResponse("static/map.jpg")