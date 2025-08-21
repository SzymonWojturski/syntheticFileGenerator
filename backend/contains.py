# backend/contains.py
import sys
from pathlib import Path
import os

def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS
    except AttributeError:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

AVAILABLE_TOKENS = resource_path("raw_data/available_tokens.json")
HASHES_FILE = resource_path("raw_data/ETH_hash.csv")
CURRENCY_VALUES_RANGE = resource_path("raw_data/currency_values_range.csv")

def get_addresses_file(token: str) -> str:
    return resource_path(f"raw_data/addresses_{token}.csv")