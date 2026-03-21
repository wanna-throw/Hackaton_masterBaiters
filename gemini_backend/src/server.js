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
const systemInstruction = `...[PEGA AQUÍ TODO EL TEXTO DEL PASO 2]...`;

app.post('/api/chat', async (req, res) => {
    const { prompt, history } = req.body; // Recibimos el mensaje y el historial

    try {
        // Usamos Gemini 1.5 Flash para mayor velocidad y menor coste (gratis)
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
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