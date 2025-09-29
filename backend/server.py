from fastapi import FastAPI
import os 
from dotenv import load_dotenv
from contextlib import asynccontextmanager
load_dotenv()
from fastapi.middleware.cors import CORSMiddleware
from src.routes.routes import Route

app= FastAPI()
app.include_router(Route)

origins=[
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



