from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import os
import requests
import json
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
from huggingface_hub import hf_hub_download, login
from dotenv import load_dotenv

load_dotenv()

app_state = {
    "model": None,
    "scaler": None,
    "columnas": None,
    "seq_length": None
}

def iniciar_simulador():
    if app_state["model"] is not None:
        return
    
    hf_token = os.getenv("HF_TOKEN")
    repo_id = os.getenv("HF_URL", "wanna-throw/housing_model")
    
    if hf_token:
        login(token=hf_token)
    
    print("📥 Descargando archivos desde Hugging Face...")
    model_path = hf_hub_download(repo_id=repo_id, filename="modelo_vivienda.keras")
    config_path = hf_hub_download(repo_id=repo_id, filename="config.json")

    print("🧠 Cargando modelo de IA...")
    model = tf.keras.models.load_model(model_path, compile=False)

    with open(config_path, "r") as f:
        config = json.load(f)
    
    columnas = config["variables"]
    seq_length = config["seq_length"]

    scaler = MinMaxScaler(feature_range=(0, 1))
    scaler.data_min_ = np.array(config["scaler_data_min"])
    scaler.data_max_ = np.array(config["scaler_data_max"])
    scaler.scale_ = 1.0 / (scaler.data_max_ - scaler.data_min_)
    scaler.min_ = -scaler.data_min_ * scaler.scale_

    app_state["model"] = model
    app_state["scaler"] = scaler
    app_state["columnas"] = columnas
    app_state["seq_length"] = seq_length
    print("✅ Modelo cargado y configurado en memoria.")


app = FastAPI(
    title="Habisim API",
    description="API REST para el proyecto Habisim",
    version="1.0.0"
)

# Añadir CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SimularParams(BaseModel):
    min_renta_hipoteca: float = Field(default=1200, description="Min. Renta Hipoteca (€)")
    interes: float = Field(default=3.5, description="Interés (%)")
    alquiler_medio: float = Field(default=800, description="Alquiler Medio (€)")
    inflacion: float = Field(default=2.8, description="Inflación (%)")
    cambio_poblacional: float = Field(default=0.5, description="Cambio Poblacional (%)")
    sueldo_medio: float = Field(default=2100, description="Sueldo Medio (€)")
    pib_per_capita: float = Field(default=28000, description="PIB Per Cápita (€)")
    viviendas_en_venta: int = Field(default=450000, description="Viviendas en Venta")
    porcentaje_alquiler: float = Field(default=24.2, description="Porcentaje Alquiler (%)")
    viviendas_vacias: int = Field(default=3400000, description="Viviendas Vacías")
    nuevas_construcciones: int = Field(default=85000, description="Nuevas Construcciones")
    precio_medio_vivienda: float = Field(default=2100, description="Precio Medio Vivienda (€/m2)")
    indice_catastrofes: int = Field(default=2, description="Índice Catástrofes (1-10)")
    ratio_comprador_vivienda: float = Field(default=3.1, description="Ratio Comprador/Vivienda")
    duracion: int = Field(default=24, description="Duración (Meses)")
    prompt: str = Field(default="", description="Leyes que querrías implementar")

@app.get("/api/v1/habisim/simular")
def simular(params: SimularParams = Depends()):
    """
    Endpoint principal para la simulación iterativa local.
    """
    try:
        iniciar_simulador()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al inicializar el modelo: {str(e)}")

    model = app_state["model"]
    scaler = app_state["scaler"]
    columnas = app_state["columnas"]
    seq_length = app_state["seq_length"]
    meses = params.duracion

    # Convertimos los parámetros elegidos a un estado inicial numérico
    dict_params = params.model_dump()
    vector_base = [0.0] * len(columnas)
    for i, col in enumerate(columnas):
        # Mapeamos los parametros exactos enviados en la query hacia el modelo
        if col in dict_params:
            vector_base[i] = float(dict_params[col])
        elif col == "precio_m2": # o cualquier otra transformacion requerida
            vector_base[i] = float(dict_params.get("precio_medio_vivienda", 0.0))

    # Creamos ventana_actual asumiendo que el mercado en los últimos 'seq_length' meses
    # era estable y tenía los valores base seleccionados en el frontend.
    ventana_actual = np.zeros((1, seq_length, len(columnas)))
    for i in range(seq_length):
        ventana_actual[0, i, :] = vector_base
        
    # Escalamos toda la ventana a los valores esperados por la IA [0, 1]
    for i in range(seq_length):
        ventana_actual[0, i, :] = scaler.transform([ventana_actual[0, i, :]])[0]

    historial = []
    ajustes = {} 

    for mes in range(meses):
        # Predicción
        pred_scaled = model.predict(ventana_actual, verbose=0)
        pred_real = scaler.inverse_transform(pred_scaled)

        # 1. GUARDARRAÍLES (Evitar valores negativos o imposibles)
        for i, col in enumerate(columnas):
            if any(x in col for x in ["precio", "sueldo", "viviendas", "alquiler", "pib", "renta"]):
                if pred_real[0][i] < 0: pred_real[0][i] = 10.0 # Suelo mínimo
            elif "pct" in col or "inflacion" in col or "interes" in col:
                pred_real[0][i] = np.clip(pred_real[0][i], -0.05, 0.20) # Rango lógico -5% a 20%

        # 2. INYECCIÓN DE LEYES (Bias del usuario)
        for var, valor in ajustes.items():
            if var in columnas:
                idx = columnas.index(var)
                pred_real[0][idx] = valor

        # Guardar resultado del mes (copiado y parseado a list of floats)
        mes_resultado = [float(x) for x in pred_real[0].copy()]
        historial.append(mes_resultado)

        # 3. ACTUALIZAR VENTANA (Feedback loop)
        pred_scaled_mod = scaler.transform(pred_real)
        nueva_entrada = pred_scaled_mod.reshape(1, 1, len(columnas))
        ventana_actual = np.append(ventana_actual[:, 1:, :], nueva_entrada, axis=1)

    return {
        "status": "success",
        "message": f"Simulación de {meses} meses ejecutada correctamente de forma local.",
        "parametros_iniciales": dict_params,
        "variables_columnas": columnas,
        "resultado_modelo": historial
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("apiRest:app", host="0.0.0.0", port=8080, reload=True)
