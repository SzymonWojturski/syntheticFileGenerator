from pydantic import BaseModel
from typing import Optional
from typing import List
from enum import Enum


class FileFormatEnum(str, Enum):
    CSV = 'csv'
    XLSX = 'xlsx'
    JSON = 'json'
    PDF = 'pdf'


class FileParameters(BaseModel):
    rows: int
    type: FileFormatEnum
    seed: Optional[int] = None
    columns: List["ColumnParameters"]

    class Config:
        from_attributes = True


class ColumnParameters(BaseModel):
    name: str
    is_int: bool
    min: int
    max: int
    unit: str

    class Config:
        from_attributes = True
