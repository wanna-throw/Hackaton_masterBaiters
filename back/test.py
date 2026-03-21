import requests
import random
import json

# URL de la API local
API_URL = "http://127.0.0.1:8080/api/v1/habisim/simular"

def generar_payload_aleatorio():
    """Genera un diccionario con valores aleatorios realistas para la simulación."""
    return {
        "min_renta_hipoteca": round(random.uniform(900, 2000), 2),
        "interes": round(random.uniform(1.0, 6.0), 2),
        "alquiler_medio": round(random.uniform(500, 1500), 2),
        "inflacion": round(random.uniform(0.0, 10.0), 2),
        "cambio_poblacional": round(random.uniform(-2.0, 3.0), 2),
        "sueldo_medio": round(random.uniform(1200, 3500), 2),
        "pib_per_capita": round(random.uniform(20000, 45000), 2),
        "viviendas_en_venta": random.randint(100000, 1000000),
        "porcentaje_alquiler": round(random.uniform(15.0, 40.0), 2),
        "viviendas_vacias": random.randint(1000000, 5000000),
        "nuevas_construcciones": random.randint(10000, 200000),
        "precio_medio_vivienda": round(random.uniform(1000, 4000), 2),
        "indice_catastrofes": random.randint(1, 10),
        "ratio_comprador_vivienda": round(random.uniform(1.0, 5.0), 2),
        "duracion": random.choice([12, 24, 36, 48, 60]),
        "prompt": "ha habido un terremoto, sube el precio de la vivienda y baja el alquiler, para contrarestar esto hemos bajado el iva por nuevas construcciones al 50 porciento"
    }

def main():
    payload = generar_payload_aleatorio()
    
    print("🚀 Enviando petición GET a la API con los siguientes parámetros aleatorios:")
    print(json.dumps(payload, indent=4, ensure_ascii=False))
    print("-" * 50)
    
    try:
        # Enviar petición GET con los parámetros en la URL (params)
        response = requests.get(API_URL, params=payload)
        
        # Parsear respuesta JSON
        data = response.json()
        
        if response.status_code == 200:
            print("✅ ¡Simulación completada con éxito!")
            print("Respuesta del servidor:")
            print(json.dumps(data, indent=4, ensure_ascii=False))
        else:
            print(f"⚠️ El servidor respondió con el código {response.status_code}:")
            print(json.dumps(data, indent=4, ensure_ascii=False))
            
    except requests.exceptions.ConnectionError:
        print("❌ Error de Conexión: No se pudo conectar a la API local.")
        print("Asegúrate de que el servidor FastAPI está corriendo en http://localhost:8080")
    except Exception as e:
        print(f"❌ Error inesperado: {str(e)}")

if __name__ == "__main__":
    main()
