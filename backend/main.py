from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from .schemas import FileParameters, FileFormatEnum
from .generate_files import generate_file

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/extensions")
async def extensions():
    return {"extensions": [item.value for item in FileFormatEnum]}

@app.post("/file")
async def create_file(file_parameters: FileParameters):
    file = generate_file(file_parameters)
    ext = file_parameters.extention.lower()

    if ext == "xlsx":
        media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    elif ext == "json":
        media_type = "application/json"
    else:
        media_type = f"text/{ext}"

    headers = {
        "Content-Disposition": f'attachment; filename="synthetic_file.{ext}"'
    }

    return StreamingResponse(file, headers=headers, media_type=media_type)
