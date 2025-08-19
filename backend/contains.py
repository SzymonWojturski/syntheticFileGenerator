from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
RAW_DATA_DIR = BASE_DIR / "raw_data"

HASHES_FILE = RAW_DATA_DIR / "ETH_hash.csv"
AVAILABLE_TOKENS= RAW_DATA_DIR/ "available_tokens.json"
CURRENCY_VALUES_RANGE= RAW_DATA_DIR / "currency_values_range.csv"

def get_addresses_file(token: str) -> Path:
    return RAW_DATA_DIR / f"addresses_{token}.csv"