import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [mensaje, setMensaje] = useState("Cargando...");

  // URL pública del backend en Railway
  const apiUrl = "https://proyecto-fullstack-production.up.railway.app";

  useEffect(() => {
    fetch(`${apiUrl}/api`)
      .then(async (res) => {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          setMensaje(data.message);
        } catch {
          setMensaje("Backend respondió texto: " + text);
        }
      })
      .catch((err) => {
        setMensaje("Error al conectar con la API: " + err.message);
      });
  }, [apiUrl]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Frontend React ?</h1>
      <p>Respuesta del backend: {mensaje}</p>
      <p style={{ fontSize: "0.8rem" }}>URL usada: {apiUrl}/api</p>
    </div>
  );
}

export default App;
