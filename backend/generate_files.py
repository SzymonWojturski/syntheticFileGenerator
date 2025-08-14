import random
from backend.schemas import FileParameters,FileFormatEnum
import io 
import pandas as pd
import os
from csv import DictReader, writer
DEMO_FILE_ROWS=10
from datetime import datetime, timedelta, date

def random_date(start_date=datetime(2010,1,1,0,0),end_date=datetime.now()):
    delta = end_date - start_date
    delta_in_second = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = random.randrange(delta_in_second)
    return start_date + timedelta(seconds=random_second)


def get_tokens():
    dirname = os.path.dirname(__file__)
    filename = os.path.join(dirname, 'raw_data/currency_values_range_rotated.csv')
    with open(filename, "r", encoding="utf-8") as f:
        reader = DictReader(f)
        data = []
        for row in reader:
            keys = list(row.keys())
            
            row[keys[1]] = float(row[keys[1]])
            row[keys[2]] = float(row[keys[2]])
            
            data.append(row)
        return data

def get_wallets(number):
    dirname = os.path.dirname(__file__)
    filename=os.path.join(dirname, 'raw_data/10000richAddressETH.csv')
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
    tokens=get_tokens()
    wallets=get_wallets(file_parameters.wallets)
    hashes=get_hashes(file_parameters.rows)
    data=[]
    for i in range(file_parameters.rows):
        token=random.choice(tokens)
        amount_flat=random.uniform(file_parameters.usd_min,file_parameters.usd_max)
        asset_rate=random.uniform(token["min"],token["max"])
        date=random_date()
        wallet=random.choice(wallets)
        partial={
            "Tx number":i,
            "Effect":amount_flat/asset_rate,
            "Ticker":token["ticker"],
            "Amount flat (USD)":amount_flat,
            "Asset rate (USD)":asset_rate,
            "Type":"will be implemented",
            "Date":date,
            "Wallet address":wallet,
            "Third-party adress":0,
            "Transaction hash":hashes[i],
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
            pdf_bytes = generate_pdf(file_parameters)  # powinno zwrócić bytes
            return io.BytesIO(pdf_bytes)


# def generate_csv(file_parameters: FileParameters):
#     if file_parameters.seed:
#         random.seed(file_parameters.seed)
#     fieldnames = [f"{column.name}[{column.unit}]" for column in file_parameters.columns]

#     file = StringIO()
#     writer = csv.DictWriter(file, fieldnames=fieldnames)
#     writer.writeheader()
#     for i in range(file_parameters.rows):
#         row_data={}
#         for column in file_parameters.columns:
#             row_data[f"{column.name}[{column.unit}]"]=custom_random(column)
#         writer.writerow(row_data)
#     file.seek(0)
#     return file

# def generate_json(file_parameters: FileParameters):
#     if file_parameters.seed:
#         random.seed(file_parameters.seed)

#     file_data = []
#     for column in file_parameters.columns:
#         column_data = {"name": column.name, "unit": column.unit}
#         random_data=[]
#         for i in range(file_parameters.rows):
#             random_data.append(custom_random(column))
#         column_data["data"]=random_data
#         file_data.append(column_data)

#     file = StringIO()
#     json.dump(file_data, file, ensure_ascii=False, indent=4)
#     file.seek(0)
#     return file



# def generate_xlsx(file_parameters):
#     if file_parameters.seed:
#         random.seed(file_parameters.seed)
#     wb = Workbook()
#     ws = wb.active

#     fieldnames = [f"{column.name}[{column.unit}]" for column in file_parameters.columns]
#     ws.append(fieldnames)

#     for _ in range(file_parameters.rows):
#         row_data = [custom_random(column) for column in file_parameters.columns]
#         ws.append(row_data)

#     file = BytesIO()
#     wb.save(file)
#     file.seek(0)
#     return file


# def generate_pdf(file_parameters: FileParameters):
#     if file_parameters.seed:
#         random.seed(file_parameters.seed)

#     buffer = BytesIO()
#     doc = SimpleDocTemplate(buffer, pagesize=letter)

#     headers = [f"{column.name}[{column.unit}]" for column in file_parameters.columns]
#     data = [headers]

#     for _ in range(file_parameters.rows):
#         row = [custom_random(column) for column in file_parameters.columns]
#         data.append(row)

#     table = Table(data)

#     style = TableStyle([
#         ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
#         ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
#         ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
#         ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
#         ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
#         ('GRID', (0, 0), (-1, -1), 1, colors.black),
#     ])
#     table.setStyle(style)

#     elements = [table]
#     doc.build(elements)

#     buffer.seek(0)
#     return buffer