import random
from backend.schemas import FileParameters,FileFormatEnum
import io 
import pandas as pd
import os
from csv import DictReader, writer
import json
DEMO_FILE_ROWS=10
from datetime import datetime, timedelta, date
from reportlab.lib.pagesizes import A4, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet

def random_date(start_date=datetime(2010,1,1,0,0),end_date=datetime.now()):
    delta = end_date - start_date
    delta_in_second = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = random.randrange(delta_in_second)
    return start_date + timedelta(seconds=random_second)


def get_token_names():
    dirname = os.path.dirname(__file__)
    filename = os.path.join(dirname, 'raw_data/avalivble_tokens.json')

    with open(filename) as f:
        d = json.load(f)
        return d


def get_token_data():
    dirname = os.path.dirname(__file__)
    filename = os.path.join(dirname, 'raw_data/currency_values_range_rotated.csv')

    with open(filename, "r", encoding="utf-8") as f:
        reader = DictReader(f)
        data = []

        for row in reader:
            row['max'] = float(row['max'])
            row['min'] = float(row['min'])
            data.append(row)

    token_map = {item['ticker']: {'min': item['min'], 'max': item['max']} for item in data}
    return token_map

def get_wallets(token,number):
    dirname = os.path.dirname(__file__)
    filename=os.path.join(dirname, f'raw_data/addresses_{token}.csv')
    wallets = pd.read_csv(filename).sample(n=number).values
    wallets=[wallet[0] for wallet in wallets]
    return wallets

def get_hashes(number):
    dirname = os.path.dirname(__file__)
    filename=os.path.join(dirname, 'raw_data/20250723213212_ETH_hash.csv')
    hashes = pd.read_csv(filename).sample(n=number).values
    hashes=[wallet[0] for wallet in hashes]
    return hashes
    
def generate_data(file_parameters: FileParameters):
    if(file_parameters.seed!=None):
        random.seed(file_parameters.seed)
    dirname = os.path.dirname(__file__)
    filename = os.path.join(dirname, 'raw_data/currency_values_range.csv')
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
        date=random_date()
        wallet=random.choice(wallets[token])
        partial={
            "Tx number":i,
            "Effect":amount_flat/asset_rate,
            "Ticker":token,
            "Amount flat (USD)":amount_flat,
            "Asset rate (USD)":asset_rate,
            "Type":"will be implemented",
            "Date":date,
            "Wallet address":wallet,
            "Third-party adress":0,
            "Transaction hash":hashes[i] if token not in ["TRX","BTC"] else hashes[i][2:],
        }
        data.append(partial)
    return data



def generate_file(file_parameters: FileParameters):
    file_data = generate_data(file_parameters)
    df = pd.DataFrame(file_data)
    df['Date'] = df['Date'].dt.strftime('%Y-%m-%d %H:%M:%S')
    output = io.BytesIO()
    
    match file_parameters.extention:
        case FileFormatEnum.CSV:
            df.to_csv(output, index=False)
            output.seek(0)
            return output
        case FileFormatEnum.JSON:
            json_bytes = generate_json(file_parameters).encode('utf-8')
            return io.BytesIO(json_bytes)
        case FileFormatEnum.XLSX:
            with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
                df.to_excel(writer, index=False)
            output.seek(0)
            return output
        case FileFormatEnum.PDF:
            pdf_bytes = generate_pdf(file_parameters)
            return io.BytesIO(pdf_bytes)

def random_date(start_date=datetime(2010,1,1,0,0),end_date=datetime.now()):
    delta = end_date - start_date
    delta_in_second = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = random.randrange(delta_in_second)
    return start_date + timedelta(seconds=random_second)


def get_token_names():
    dirname = os.path.dirname(__file__)
    filename = os.path.join(dirname, 'raw_data/avalivble_tokens.json')

    with open(filename) as f:
        d = json.load(f)
        return d


def get_token_data():
    dirname = os.path.dirname(__file__)
    filename = os.path.join(dirname, 'raw_data/currency_values_range_rotated.csv')

    with open(filename, "r", encoding="utf-8") as f:
        reader = DictReader(f)
        data = []

        for row in reader:
            row['max'] = float(row['max'])
            row['min'] = float(row['min'])
            data.append(row)

    token_map = {item['ticker']: {'min': item['min'], 'max': item['max']} for item in data}
    return token_map

def get_wallets(token,number):
    dirname = os.path.dirname(__file__)
    filename=os.path.join(dirname, f'raw_data/addresses_{token}.csv')
    wallets = pd.read_csv(filename).sample(n=number).values
    wallets=[wallet[0] for wallet in wallets]
    return wallets

def get_hashes(number):
    dirname = os.path.dirname(__file__)
    filename=os.path.join(dirname, 'raw_data/20250723213212_ETH_hash.csv')
    hashes = pd.read_csv(filename).sample(n=number).values
    hashes=[wallet[0] for wallet in hashes]
    return hashes


def generate_file(file_parameters: FileParameters):
    file_data = generate_data(file_parameters)
    df = pd.DataFrame(file_data)
    df['Date'] = df['Date'].dt.strftime('%Y-%m-%d %H:%M:%S')
    output = io.BytesIO()
    
    match file_parameters.extention:
        case FileFormatEnum.CSV:
            df.to_csv(output, index=False)
            output.seek(0)
            return output
        case FileFormatEnum.JSON:
            json_bytes = generate_json(file_parameters).encode('utf-8')
            return io.BytesIO(json_bytes)
        case FileFormatEnum.XLSX:
            with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
                df.to_excel(writer, index=False)
            output.seek(0)
            return output
        case FileFormatEnum.PDF:
            pdf_bytes = generate_pdf(file_parameters)
            return io.BytesIO(pdf_bytes)

def generate_json(file_parameters: FileParameters):
    data = generate_data(file_parameters)
    return json.dumps(data, indent=4, default=str)


from reportlab.pdfbase.pdfmetrics import stringWidth

def generate_pdf(file_parameters: FileParameters):
    data = generate_data(file_parameters)
    df = pd.DataFrame(data)

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
    return pdf_bytes