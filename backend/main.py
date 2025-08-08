from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from backend.schemas import FileParameters,FileFormatEnum
from backend.generate_files import generate_file

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


@app.get("/types")
async def root():
    return {"types": [item.value for item in FileFormatEnum]}


@app.post("/params")
async def params(file_parameters: FileParameters):
    return {"file": generate_file(file_parameters)}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)