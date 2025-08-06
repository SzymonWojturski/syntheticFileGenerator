from pydantic import BaseModel
from typing import List
from enum import Enum,IntEnum

class FileFormatEnum(str, Enum):
    CSV = 'csv'
    XLSX = 'xlsx'

class FileParameters(BaseModel):
    rows: int
    type: FileFormatEnum
    columns: List["ColumnParameters"]
    class Config:
        from_attributes = True


class ColumnParameters(BaseModel):
    min: int
    max: int
    unit: str
    class Config:
        from_attributes = True