import { useEffect, useState } from "react";
import "./App.css";

// usa la variable de entorno si existe, si no, usa localhost
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  const [mensajeApi, setMensajeApi] = useState("Cargando mensaje...");
  const [estudiantes, setEstudiantes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  // 1. traer el /api (solo para mostrar que conecta)
  useEffect(() => {
    fetch(`${API_BASE}/api`)
      .then((res) => res.json())
      .then((data) => setMensajeApi(data.message))
      .catch(() => setMensajeApi("No se pudo conectar con /api"));
  }, []);

  // 2. traer la lista de estudiantes
  const cargarEstudiantes = () => {
    fetch(`${API_BASE}/api/estudiantes`)
      .then((res) => res.json())
      .then((data) => {
        setEstudiantes(data);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudo cargar la lista");
      });
  };

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  // 3. crear estudiante
  const manejarSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setCargando(true);
    fetch(`${API_BASE}/api/estudiantes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, correo }),
    })
      .then((res) => res.json())
      .then(() => {
        setNombre("");
        setCorreo("");
        cargarEstudiantes();
      })
      .catch(() => {
        setError("No se pudo crear el estudiante");
      })
      .finally(() => setCargando(false));
  };

  // 4. borrar
  const borrarEstudiante = (id) => {
    fetch(`${API_BASE}/api/estudiantes/${id}`, {
      method: "DELETE",
    })
      .then(() => cargarEstudiantes())
      .catch(() => setError("No se pudo borrar"));
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem", color: "white" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Frontend React ✅</h1>

      <p style={{ marginBottom: "1rem" }}>
        Respuesta del backend (/api): <strong>{mensajeApi}</strong>
      </p>
      <p style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "2rem" }}>
        URL usada: {API_BASE}/api
      </p>

      <section
        style={{
          background: "#1f2937",
          padding: "1.5rem",
          borderRadius: "1rem",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>Nuevo estudiante</h2>
        <form onSubmit={manejarSubmit} style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={{ padding: "0.5rem", flex: "1 1 200px" }}
          />
          <input
            type="email"
            placeholder="Correo (opcional)"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            style={{ padding: "0.5rem", flex: "1 1 200px" }}
          />
          <button
            type="submit"
            disabled={cargando}
            style={{
              background: "#10b981",
              border: "none",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              borderRadius: "0.5rem",
            }}
          >
            {cargando ? "Guardando..." : "Guardar"}
          </button>
        </form>
        {error && <p style={{ color: "salmon", marginTop: "1rem" }}>{error}</p>}
      </section>

      <section>
        <h2 style={{ marginBottom: "1rem" }}>Listado de estudiantes</h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#111827",
          }}
        >
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #374151", textAlign: "left", padding: "0.5rem" }}>
                ID
              </th>
              <th style={{ borderBottom: "1px solid #374151", textAlign: "left", padding: "0.5rem" }}>
                Nombre
              </th>
              <th style={{ borderBottom: "1px solid #374151", textAlign: "left", padding: "0.5rem" }}>
                Correo
              </th>
              <th style={{ borderBottom: "1px solid #374151", textAlign: "left", padding: "0.5rem" }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: "1rem" }}>
                  No hay estudiantes
                </td>
              </tr>
            ) : (
              estudiantes.map((est) => (
                <tr key={est.id}>
                  <td style={{ padding: "0.5rem" }}>{est.id}</td>
                  <td style={{ padding: "0.5rem" }}>{est.nombre}</td>
                  <td style={{ padding: "0.5rem" }}>{est.correo}</td>
                  <td style={{ padding: "0.5rem" }}>
                    <button
                      onClick={() => borrarEstudiante(est.id)}
                      style={{
                        background: "#ef4444",
                        border: "none",
                        padding: "0.3rem 0.7rem",
                        borderRadius: "0.3rem",
                        cursor: "pointer",
                      }}
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;
