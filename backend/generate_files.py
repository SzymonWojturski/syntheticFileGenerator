import random
from schemas import FileParameters,ColumnParameters,FileFormatEnum
import csv
from io import StringIO
import json
from io import BytesIO
from openpyxl import Workbook
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib import colors
DEMO_FILE_ROWS=10

def custom_random(column:ColumnParameters):
    if column.is_int:
        return random.randrange(column.min,column.max)
    return random.uniform(column.min, column.max)

def generate_file(file_parameters: FileParameters):
    match file_parameters.type:
        case FileFormatEnum.CSV:
            return generate_csv(file_parameters)
        case FileFormatEnum.JSON:
            return generate_json(file_parameters)
        case FileFormatEnum.XLSX:
            return generate_xlsx(file_parameters)
        case FileFormatEnum.PDF:
            return generate_pdf(file_parameters)



def generate_csv(file_parameters: FileParameters):
    if file_parameters.seed:
        random.seed(file_parameters.seed)
    fieldnames = [f"{column.name}[{column.unit}]" for column in file_parameters.columns]

    file = StringIO()
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    writer.writeheader()
    for i in range(file_parameters.rows):
        row_data={}
        for column in file_parameters.columns:
            row_data[f"{column.name}[{column.unit}]"]=custom_random(column)
        writer.writerow(row_data)
    file.seek(0)
    return file

def generate_json(file_parameters: FileParameters):
    if file_parameters.seed:
        random.seed(file_parameters.seed)

    file_data = []
    for column in file_parameters.columns:
        column_data = {"name": column.name, "unit": column.unit}
        random_data=[]
        for i in range(file_parameters.rows):
            random_data.append(custom_random(column))
        column_data["data"]=random_data
        file_data.append(column_data)

    file = StringIO()
    json.dump(file_data, file, ensure_ascii=False, indent=4)
    file.seek(0)
    return file



def generate_xlsx(file_parameters):
    if file_parameters.seed:
        random.seed(file_parameters.seed)
    wb = Workbook()
    ws = wb.active

    fieldnames = [f"{column.name}[{column.unit}]" for column in file_parameters.columns]
    ws.append(fieldnames)

    for _ in range(file_parameters.rows):
        row_data = [custom_random(column) for column in file_parameters.columns]
        ws.append(row_data)

    file = BytesIO()
    wb.save(file)
    file.seek(0)
    return file


def generate_pdf(file_parameters: FileParameters):
    if file_parameters.seed:
        random.seed(file_parameters.seed)

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)

    headers = [f"{column.name}[{column.unit}]" for column in file_parameters.columns]
    data = [headers]

    for _ in range(file_parameters.rows):
        row = [custom_random(column) for column in file_parameters.columns]
        data.append(row)

    table = Table(data)

    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ])
    table.setStyle(style)

    elements = [table]
    doc.build(elements)

    buffer.seek(0)
    return buffer

def generate_file_demo(file_parameters: FileParameters):
    file_data = []
    for column in file_parameters.columns:
        random_data = [random.uniform(column.min, column.max)
                       for _ in range(min(file_parameters.rows,DEMO_FILE_ROWS))]
        file_data.append({"name":column.name,"unit":column.unit, "data":random_data})

    return file_data