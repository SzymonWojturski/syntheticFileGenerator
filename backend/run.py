from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from backend.schemas import FileParameters,FileFormatEnum
from backend.generate_files import generate_file
from fastapi.responses import StreamingResponse

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

@app.get("/extentions")
async def extentions():
    return {"extentions": [item.value for item in FileFormatEnum]}


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
        'Content-Disposition': f'attachment; filename="synthetic_file.{ext}"'
    }

    return StreamingResponse(file, headers=headers, media_type=media_type)