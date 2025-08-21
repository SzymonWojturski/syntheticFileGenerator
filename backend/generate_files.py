import random
from backend.schemas import FileParameters,FileFormatEnum
import io 
import pandas as pd
import os
from csv import DictReader, writer
import json
from datetime import datetime, timedelta, date
from reportlab.lib.pagesizes import A4, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.pdfbase.pdfmetrics import stringWidth
from backend.contains import HASHES_FILE, get_addresses_file,AVAILABLE_TOKENS,CURRENCY_VALUES_RANGE
import orjson
from typing import Optional

def get_token_names() -> list[str]:
    with open(AVAILABLE_TOKENS, "r", encoding="utf-8") as f:
        return json.load(f)


def get_token_data()->dict[str,dict[str,str]]:
    with open(CURRENCY_VALUES_RANGE, "r", encoding="utf-8") as f:
        reader = DictReader(f)
        data = []
        for row in reader:
            row['max'] = float(row['max'])
            row['min'] = float(row['min'])
            data.append(row)

    token_map = {item['ticker']: {'min': item['min'], 'max': item['max']} for item in data}
    return token_map

def get_wallets(token,number)->list[str]:
    filename=get_addresses_file(token)
    wallets = pd.read_csv(filename).sample(n=number).values
    wallets=[wallet[0] for wallet in wallets]
    return wallets

def csv_reservoir_sampling(filename,n)->list[str]:
    reservoir = []
    with open(filename, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f):
            line = line.strip()
            if i < n:
                reservoir.append(line)
            else:
                j = random.randint(0, i)
                if j < n:
                    reservoir[j] = line
    return reservoir

def random_date(start_date: Optional[date] = None, end_date: Optional[date] = None) -> datetime:
    delta_in_seconds = int((end_date - start_date).total_seconds())
    if delta_in_seconds <= 0:
        return start_date

    random_second = random.randrange(delta_in_seconds)
    return start_date + timedelta(seconds=random_second)

def get_hashes(number)->list[str]:
    hashes = csv_reservoir_sampling(HASHES_FILE,number)
    return hashes
    
def generate_data(file_parameters: FileParameters)->list[dict]:
    if(file_parameters.seed!=None):
        random.seed(file_parameters.seed)
    tokens=get_token_names()
    wallets={}
    for token in tokens:
        wallets[token]=get_wallets(token,file_parameters.wallets)
    
    token_data=get_token_data()

    hashes=get_hashes(file_parameters.rows)
    data=[]
    for i in range(file_parameters.rows):
        token=random.choice(tokens)
        amount_flat=random.uniform(file_parameters.usd_min,file_parameters.usd_max)
        asset_rate=random.uniform(token_data[token]["min"],token_data[token]["max"])
        date=random_date(start_date=file_parameters.date_min,end_date=file_parameters.date_max)
        wallet=random.choice(wallets[token])
        partial={
            "Tx number":i,
            "Effect":amount_flat/asset_rate,
            "Ticker":token,
            "Amount flat (USD)":amount_flat,
            "Asset rate (USD)":asset_rate,
            "Type":random.choice(["Purchase", "Sale"]),
            "Date":date,
            "Wallet address":wallet,
            "Third-party adress":0,
            "Transaction hash":hashes[i] if token not in ["TRX","BTC"] else hashes[i][2:],
        }
        data.append(partial)
    return data

def get_token_names()->list[str]:
    dirname = os.path.dirname(__file__)
    filename = os.path.join(dirname, AVAILABLE_TOKENS)

    with open(filename) as f:
        d = json.load(f)
        return d

def generate_file(file_parameters: FileParameters) -> io.BytesIO:
    file_data = generate_data(file_parameters)
    return convert_data_to_file(file_data,file_parameters.extention)

def convert_data_to_file(file_data,file_extention)-> io.BytesIO:

    match file_extention:

        case FileFormatEnum.JSON:
            return generate_json(file_data)
        
        case FileFormatEnum.PDF:
            return generate_pdf(file_data)
        
        case FileFormatEnum.CSV:
            return generate_csv(file_data)

        case FileFormatEnum.XLSX:
            return generate_xlsx(file_data)

def file_data_to_df(file_data) ->pd.DataFrame:
    df = pd.DataFrame(file_data)
    df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
    df['Date'] = df['Date'].dt.strftime(r"%Y-%m-%d %H:%M:%S")
    return df

def generate_xlsx(file_data)-> io.BytesIO:
    output = io.BytesIO()
    df=file_data_to_df(file_data)
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False)
    output.seek(0)
    return output

def generate_csv(file_data)-> io.BytesIO:
    output = io.BytesIO()
    df=file_data_to_df(file_data)
    df.to_csv(output, index=False)
    output.seek(0)
    return output

def generate_json(file_data) -> io.BytesIO:
    bytes_data = orjson.dumps(file_data)
    return io.BytesIO(bytes_data)

def generate_pdf(file_data):
    df = pd.DataFrame(file_data)

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=landscape(A4))
    elements = []

    styles = getSampleStyleSheet()
    title = Paragraph("Generated Transactions Report", styles['Title'])
    elements.append(title)

    df = df.astype(str)
    table_data = [df.columns.tolist()] + df.values.tolist()

    font_name = "Helvetica"
    font_size = 6
    max_widths = []
    for col_idx in range(len(df.columns)):
        max_len_item = max([row[col_idx] for row in table_data], key=len)
        text_width = stringWidth(max_len_item, font_name, font_size)
        max_widths.append(text_width+5)

    table = Table(table_data, repeatRows=1, colWidths=max_widths)

    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#4F81BD")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), font_size),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 3),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor("#F2F2F2")),
        ('GRID', (0, 0), (-1, -1), 0.25, colors.black),
    ]))

    elements.append(table)
    doc.build(elements)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return io.BytesIO(pdf_bytes)