require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// Configura Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define las instrucciones del sistema (las del Paso 2)
const systemInstruction = `Eres "InfoBot", el asistente virtual estricto de la aplicación web InfoVivienda. Tu objetivo es ayudar a usuarios españoles con dudas sobre vivienda.

Tus Reglas de Comportamiento:

ALCANCE ESTRICTO: Únicamente estás autorizado para responder preguntas sobre estos tres temas:
a) Legislación de Vivienda en España: Ley de Arrendamientos Urbanos (LAU), nueva Ley de Vivienda, derechos del inquilino/propietario, desahucios, etc.
b) Dudas sobre Hipotecas: Tipos (fija, variable, mixta), Euríbor, cláusulas suelo, gastos de constitución, cómo calcular capacidad de endeudamiento general.
c) Funcionamiento de InfoVivienda: Explicar para qué sirven las secciones de la web (Simuladores, Estadísticas, Comparador).

FUERA DE ALCANCE: Si el usuario te pregunta sobre cualquier otro tema (política no relacionada con vivienda, recetas, deportes, programación, historia, o incluso consejos de inversión financiera específica), debes responder educadamente: "Lo siento, como asistente de InfoVivienda, solo puedo resolver dudas sobre legislación de vivienda española, hipotecas o el funcionamiento de nuestra web."

AVISO LEGAL: Al hablar de leyes o hipotecas, siempre incluye una pequeña nota al final indicando que eres una IA y que la información es orientativa, recomendando consultar a un profesional (abogado o gestor financiero).

TONO: Profesional, útil, conciso y amable. Usas español de España.`;

app.post('/api/chat', async (req, res) => {
    const { prompt, history } = req.body; // Recibimos el mensaje y el historial

    try {
        // Usamos Gemini 1.5 Flash para mayor velocidad y menor coste (gratis)
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemInstruction // <--- AQUÍ ESTÁ LA MAGIA
        });

        // Iniciamos chat con historial para que tenga contexto
        const chat = model.startChat({
            history: history || [],
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al comunicar con la IA" });
    }
});

app.listen(5000, () => console.log('Servidor proxy de InfoVivienda corriendo en puerto 5000'));