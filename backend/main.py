from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from schemas import FileParameters,FileFormatEnum
from generate_files import generate_file
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


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/types")
async def root():
    return {"types": [item.value for item in FileFormatEnum]}

# @app.post("/demo")
# async def root(file_parameters: FileParameters):
#     return {"demo":generate_file_demo(file_parameters)}

@app.post("/file")
async def params(file_parameters: FileParameters):
    file = generate_file(file_parameters)

    # return {"file":file}
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
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)