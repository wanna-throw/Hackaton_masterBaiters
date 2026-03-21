require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// Configura Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ── Instrucción InfoBot (Asistente General) ───────────────────────────
const INFOBOT_INSTRUCTION = `Eres "InfoBot", el asistente virtual de InfoVivienda.
ALCANCE: Legislación Española, Hipotecas y funcionamiento de la web.
TONO: Profesional y conciso.
AVISO LEGAL: Indica siempre que la info es orientativa y recomienda profesionales.
Tambien tienes que guiar al usuario si lo pide por las diferentes secciones de la web y sus funciones.
Si el usuario quiere ver datos reales de españa, redirigelo a la seción de Estadísticas o Dashboard de Estadísticas.
Si quiere simular una ley que vaya al apartado de simulador de leyes.
Si quiere simular una hipoteca que vaya al apartado de simulador de hipotecas.
Si quiere comparar datos legislativos de diferentes paises que vaya al comparador`;

// ── Instrucción HabiSim (Simulador Predictivo) ────────────────────────
const HABISIM_INSTRUCTION = `Eres "HabiSim", el motor analítico de InfoVivienda.
TU MISIÓN: Simular el impacto de leyes de vivienda sobre indicadores económicos.
ENTRADA: Un set de leyes y parámetros (inflación, interés, etc.).
SALIDA: Debes responder EXCLUSIVAMENTE en formato JSON con la siguiente estructura:
{
  "analysis": "Un resumen ejecutivo del impacto (máx 300 palabras).",
  "risks": ["Riesgo 1", "Riesgo 2"],
  "predictions": [[mes1_data], [mes2_data], ...]
}
Cada sub-array de predictions representa un mes (longitud definida por el usuario) y contiene los 14 indicadores del CSV:
[min_renta_hipoteca, interes, alquiler_medio, inflacion, cambio_poblacional, sueldo_medio, pib_per_capita, viviendas_venta, pct_alquiler, viviendas_vacias, nuevas_construcciones, precio_medio_vivienda, indice_catastrofes, ratio_comprador_vivienda]
IMPORTANTE: Sé realista basándote en la teoría económica (ej: si sube la inflación drásticamente, el precio de la vivienda suele subir pero el interés también).`;

// Endpoint Chat General (InfoBot / HipotSim)
app.post('/api/chat', async (req, res) => {
    const { prompt, history } = req.body;
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: INFOBOT_INSTRUCTION
        });
        const chat = model.startChat({ history: history || [] });
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        res.json({ text: response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en InfoBot" });
    }
});

// Endpoint HabiSim (Simulación Predictiva)
app.post('/api/habisim', async (req, res) => {
    const { prompt, params } = req.body;
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: HABISIM_INSTRUCTION,
            generationConfig: { responseMimeType: "application/json" }
        });

        const fullPrompt = `Leyes a simular: ${prompt}\n\nParámetros iniciales:\n${JSON.stringify(params)}`;
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        res.json(JSON.parse(response.text()));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en la simulación HabiSim" });
    }
});

app.listen(5000, () => console.log('Backend de InfoVivienda corriendo en puerto 5000'));