import random
from backend.schemas import FileParameters


def generate_file(file_parameters: FileParameters):
    file_data = {}
    for column in file_parameters.columns:
        random_data = [random.uniform(column.min, column.max)
                       for _ in range(file_parameters.rows)]
        file_data[column.name] = random_data

    return file_data
