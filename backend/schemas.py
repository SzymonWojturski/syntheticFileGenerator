from pydantic import BaseModel
from typing import List


class FileParameters(BaseModel):
    rows: int
    type: str  # for now
    columns: List["ColumnParameters"]
    class Config:
        from_attributes = True


class ColumnParameters(BaseModel):
    min: int
    max: int
    unit: str
    class Config:
        from_attributes = True