import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [mensaje, setMensaje] = useState("Cargando...");

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setMensaje(data.message))
      .catch((err) =>
        setMensaje("Error al conectar con la API: " + err.message)
      );
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Frontend React ?</h1>
      <p>Respuesta del backend: {mensaje}</p>
    </div>
  );
}

export default App;
