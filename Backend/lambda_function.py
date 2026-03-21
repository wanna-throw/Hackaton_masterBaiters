import json
import requests
import os
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = "token"
LLM_API_URL = "https://api-inference.huggingface.co/models/modelo-llm"
PREDICT_API_URL = "https://api-inference.huggingface.co/models/modelo-predictivo"

def query_hf(api_url, payload):
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    response = requests.post(api_url, headers=headers, json=payload)
    return response.json()

def lambda_handler(event, context):
    try:
        body = json.loads(event.get('body', '{}'))
        user_input = body.get('pregunta', 'Hola')
        resultado_prediccion = {"valor": 100, "tendencia": "alcista"} 

        prompt = f"El usuario pregunta: {user_input}. La predicción es: {resultado_prediccion}. Explícalo brevemente."
        analisis_ia = query_hf(LLM_API_URL, {"inputs": prompt})

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'respuesta_texto': analisis_ia,
                'datos_grafica': resultado_prediccion
            })
        }
    except Exception as e:
        return {'statusCode': 500, 'body': json.dumps({'error': str(e)})}