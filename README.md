# Synthetic File Generator

**Synthetic File Generator** is a tool to generate random cryptocurrency trade operations for testing and simulation purposes.

## Backend

### Endpoints

#### 1. `POST /file`
Returns a randomly generated file with synthetic trade data.

**Request Parameters (JSON):**  
```json
{
  "rows": 0,        // Number of trade rows to generate
  "wallets": 0,     // Number of unique wallets to simulate
  "usd_min": 0,     // Minimum USD value per trade
  "usd_max": 0,     // Maximum USD value per trade
  "extension": "csv", // File format (available: csv, xlsx, json, pdf)
  "date_max": "2025-08-14", // [Optional] Latest possible date for trades
  "seed": 0        // [Optional] Seed for random generation
}
```

**Response:**  
A file containing the generated synthetic trades according to the requested parameters.

### How to Run

1. **Create a virtual environment**  
```bash
python -m venv venv
```

2. **Install dependencies**  
```bash
pip install -r backend/requirements.txt
```

3. **Run the backend server**  
```bash
python backend/main.py
```

4. **Access the API documentation**  
Open in your browser: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### Notes

- Use the `seed` parameter for reproducible random data.  
- Supported file formats: `csv`, `xlsx`, `json`, `pdf`.  
- Ensure `usd_min` ≤ `usd_max` for valid trade values.