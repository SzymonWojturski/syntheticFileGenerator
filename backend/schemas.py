from pydantic import BaseModel
from typing import List
from enum import Enum


class FileFormatEnum(str, Enum):
    CSV = 'csv'
    XLSX = 'xlsx'
    JSON = 'json'


class FileParameters(BaseModel):
    rows: int
    type: FileFormatEnum
    columns: List["ColumnParameters"]

    class Config:
        from_attributes = True


class ColumnParameters(BaseModel):
    name: str
    min: int
    max: int
    unit: str

    class Config:
        from_attributes = True
