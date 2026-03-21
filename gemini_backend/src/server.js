require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// Configura Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ── Instrucción InfoBot (Asistente General / Soporte) ───────────────────────────
const INFOBOT_INSTRUCTION = `Eres "InfoBot", el asistente virtual de InfoVivienda.
ALCANCE: Guía de uso de la aplicación, dudas generales sobre vivienda en España.
Tambien tienes que guiar al usuario si lo pide por las diferentes secciones de la web y sus funciones.
Si el usuario quiere ver datos reales de españa, redirigelo a la seción de Estadísticas o Dashboard de Estadísticas.
Si quiere simular una ley que vaya al apartado de simulador de leyes.
Si quiere simular una hipoteca que vaya al apartado de simulador de hipotecas.
Si quiere comparar datos legislativos de diferentes paises que vaya al comparador.
Tono: Profesional y amable. Indica que eres una IA.`;

// ── Instrucción HipotSim (Asesor Financiero y de Vivienda) ────────────────────────
const HIPOTSIM_INSTRUCTION = `Eres "HipotSim", el asesor financiero experto de InfoVivienda.
TU MISIÓN: Ayudar a los usuarios a decidir si les conviene hipotecarse o alquilar un piso basándose en su situación económica.
REGLAS ESTRICTAS:
1. Solo puedes responder consultas sobre hipotecas, alquileres, cálculos de rentabilidad y comparativas financieras de vivienda.
2. Debes pedir datos si faltan (sueldo, ahorros, zona, precio vivienda) para dar un consejo preciso.
3. El tono debe ser de asesor experto, realista y cauteloso con el endeudamiento.
4. Si preguntan por legislación general o comparativa de países, redirígeles a las otras secciones de la web.
5. Ciñete EXCLUSIVAMENTE a la asesoría financiera y de vivienda respecto a hipotecarse o alquilar un piso.`;

// ── Instrucción HabiSim (Simulador Predictivo de Leyes) ────────────────────────
const HABISIM_INSTRUCTION = `Eres "HabiSim", el motor analítico de InfoVivienda.
TU MISIÓN: Simular el impacto de leyes de vivienda sobre indicadores económicos para proyectar el €/m2.
SALIDA: Debes responder EXCLUSIVAMENTE en formato JSON con la siguiente estructura:
{
  "analysis": "Análisis del impacto.",
  "risks": ["Riesgo 1"],
  "predictions": [[mes1_data], ...]
}
Cada sub-array tiene 14 indicadores. Sé realista basándote en teoría económica.`;

// ── Instrucción Comparador (Política Exterior) ────────────────────────
const COMPARADOR_INSTRUCTION = `Eres un comparador de situaciones económicas entre únicamente los países que se pasan en el prompt. 
REGLAS: Vivienda y economía únicamente. Efectos sobre vivienda.`;

// Endpoint Chat (Diferencia si es para Asesoría Financiera o Soporte General)
app.post('/api/chat', async (req, res) => {
    const { prompt, history, mode } = req.body;
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash", // Using a stable version, update as needed
            systemInstruction: mode === 'hipotsim' ? HIPOTSIM_INSTRUCTION : INFOBOT_INSTRUCTION
        });
        const chat = model.startChat({ history: history || [] });
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        res.json({ text: response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el chat" });
    }
});

// Endpoint HabiSim (Redirecciona a resultados con datos JSON)
app.post('/api/habisim', async (req, res) => {
    const { prompt, params } = req.body;
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: HABISIM_INSTRUCTION,
            generationConfig: { responseMimeType: "application/json" }
        });
        const fullPrompt = `Leyes: ${prompt}\n\nParams: ${JSON.stringify(params)}`;
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        res.json(JSON.parse(response.text()));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en HabiSim" });
    }
});

app.post('/api/compare', async (req, res) => {
    const { prompt } = req.body;
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: COMPARADOR_INSTRUCTION
        });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ text: response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en Comparador" });
    }
});

app.listen(5000, () => console.log('Backend de InfoVivienda activo en puerto 5000'));