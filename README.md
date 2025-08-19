# Synthetic File Generator

**Synthetic File Generator** is a tool for generating random cryptocurrency trade operations for testing and simulation purposes.

---

## Backend

### Endpoints

#### 1. `GET /extensions`
Returns a list of all available file formats.

**Example Response:**  
```json
{
  "extensions": ["csv", "xlsx", "json", "pdf"]
}
```

#### 2. `POST /file`
Generates and returns a file with synthetic trade data.

**Request Parameters (JSON structure):**  
```text
{
  "rows": int,            # Number of trade rows to generate
  "wallets": int,         # Number of unique wallets to simulate
  "usd_min": float,       # Minimum USD value per trade
  "usd_max": float,       # Maximum USD value per trade
  "extension": string,    # File format (e.g., csv, xlsx, json, pdf)
  "date_min": "yyyy-mm-dd", # [Optional] Earliest possible transaction date
  "date_max": "yyyy-mm-dd", # [Optional] Latest possible transaction date
  "seed": int            # [Optional] Seed for reproducible random generation
}
```



**Response:**  
A file containing the generated synthetic trades according to the requested parameters.

**Notes:**  
- Use the `seed` parameter for reproducible random data.  
- Ensure `usd_min` ≤ `usd_max` for valid trade values.  
- Check available file formats by calling `/extensions`.

---

### How to Run

1. **Create a virtual environment**  
```bash
python -m venv venv
```

2. **Activate the virtual environment**  

- Linux / macOS:  
```bash
source venv/bin/activate
```

- Windows (CMD):  
```cmd
venv\Scripts\activate
```

 - Windows (PowerShell):  
```powershell
venv\Scripts\Activate.ps1
```

3. **Install dependencies**  
```bash
pip install -r backend/requirements.txt
```

4. **Run the backend server**  
```bash
python -m backend
```

5. **Access the API documentation**  
Open in your browser: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

