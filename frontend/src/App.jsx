import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [mensaje, setMensaje] = useState("Cargando...");

  // ?? aquí ponemos DIRECTO la URL de Railway
  const apiUrl = "https://proyecto-fullstack-production.up.railway.app";

  useEffect(() => {
    fetch(`${apiUrl}/api`)
      .then((res) => res.json())
      .then((data) => setMensaje(data.message))
      .catch((err) => {
        setMensaje(`Error al conectar con la API: ${err.message}`);
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
