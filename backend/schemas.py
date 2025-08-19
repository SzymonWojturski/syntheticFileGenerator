from pydantic import BaseModel
from typing import Optional
from typing import List
from enum import Enum
from datetime import date

class FileFormatEnum(str, Enum):
    CSV = 'csv'
    XLSX = 'xlsx'
    JSON = 'json'
    PDF = 'pdf'


class FileParameters(BaseModel):
    rows: int
    seed: Optional[int] = None
    wallets:int
    usd_min:float
    usd_max:float
    date_min:Optional[date]=None
    date_max:Optional[date]=None
    extention:FileFormatEnum

    class Config:
        from_attributes = True