import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SimuladorVivienda = () => {
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [params, setParams] = useState({ meses: 24, interes: 3.5 });

    const ejecutarSimulacion = async () => {
        setLoading(true);
        try {
            // Reemplaza con la URL que te dará AWS después del despliegue
            const AWS_URL = "https://tu-api-id.aws-region.awsapprunner.com/api/simular";

            const response = await fetch(AWS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    meses_a_simular: params.meses,
                    ajustes_usuario: { "interes": params.interes / 100 },
                    // Estos datos los enviamos para que la IA tenga un punto de partida
                    datos_historicos: Array(12).fill([1500, 0.03, 900, 0.02, 0.001, 1800, 25000, 300000, 0.2, 1000000, 5000, 2200, 0, 4])
                })
            });

            const resJson = await response.json();

            // Formatear para Recharts (asumiendo que el precio es el índice 11)
            const dataGrafica = resJson.predicciones.map((mes, i) => ({
                name: `Mes ${i + 1}`,
                precio: mes[11]
            }));

            setDatos(dataGrafica);
        } catch (error) {
            console.error("Error en AWS:", error);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Simulador IA (AWS + React)</h2>
            <input
                type="number"
                value={params.interes}
                onChange={(e) => setParams({ ...params, interes: e.target.value })}
            />
            <button onClick={ejecutarSimulacion} disabled={loading}>
                {loading ? 'Calculando...' : 'Simular'}
            </button>

            <div style={{ width: '100%', height: 400, marginTop: '20px' }}>
                <ResponsiveContainer>
                    <LineChart data={datos}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip />
                        <Line type="monotone" dataKey="precio" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SimuladorVivienda;