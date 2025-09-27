from fastapi import FastAPI
from app.routers import items
from app.routers import survey
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "https://classic-plus-site-frontend.onrender.com/",  # React site URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app = FastAPI()
app.include_router(items.router)
app.include_router(survey.router)


@app.get("/")
def root():
    return {"message": "Hello from FastAPI"}
