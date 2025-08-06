from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend import schemas, generate_files

app = FastAPI()
origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/params")
async def params(file_parameters: schemas.FileParameters):
    return {"file": generate_files.generate_file(file_parameters)}
