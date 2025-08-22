from pydantic import BaseModel, field_validator, model_validator,Field
from typing import Optional
from typing import List
from enum import Enum
from datetime import date,datetime

class FileFormatEnum(str, Enum):
    CSV = 'csv'
    XLSX = 'xlsx'
    JSON = 'json'
    PDF = 'pdf'


class FileParameters(BaseModel):
    rows: int = Field(..., gt=0, description="Number of rows must be greater than 0")
    seed: Optional[int] = None
    wallets: int = Field(..., gt=0, description="Number of wallets must be greater than 0")
    usd_min: float
    usd_max: float
    date_min: Optional[datetime] = datetime(2010, 1, 1)
    date_max: Optional[datetime] = datetime.now()
    extention: FileFormatEnum

    @model_validator(mode="after")
    def check_min_max(self):
        if self.usd_max <= self.usd_min:
            raise ValueError("usd_max must be greater than usd_min")

        if self.date_min and self.date_max and self.date_max <= self.date_min:
            raise ValueError("date_max must be after date_min")
        return self

    class Config:
        from_attributes = True