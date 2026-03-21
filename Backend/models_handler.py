import requests
import os

class HuggingFaceClient:
    def __init__(self):
        self.token = os.getenv('HF_TOKEN_WRITE')
        self.headers = {"Authorization": f"Bearer {self.token}"}

    def ask_llm(self, model_id, prompt):
        url = f"https://api-inference.huggingface.co/models/{model_id}"
        payload = {"inputs": prompt, "parameters": {"max_new_tokens": 150}}
        response = requests.post(url, headers=self.headers, json=payload)
        return response.json()

    def get_lstm_prediction(self, model_id, data_sequence):
        url = f"https://api-inference.huggingface.co/models/{model_id}"
        # Los modelos LSTM suelen recibir una lista de números
        payload = {"inputs": data_sequence}
        response = requests.post(url, headers=self.headers, json=payload)
        return response.json()