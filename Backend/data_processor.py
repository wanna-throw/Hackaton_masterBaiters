import pandas as pd

class DataProcessor:
    def __init__(self, file_path):
        self.file_path = file_path

    def get_last_sequence(self):
        df = pd.read_excel(self.file_path)
        sequence = df['ventas'].tail(10).tolist()
        return sequence

    def format_for_chart(self, prediction):
        return {
            "labels": ["T-1", "T-2", "Predicción"],
            "values": [10, 20, prediction]
        }