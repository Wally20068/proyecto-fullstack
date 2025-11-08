import { useEffect, useState } from "react";
import "./App.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  const [mensajeApi, setMensajeApi] = useState("");
  const [estadoApi, setEstadoApi] = useState("?");
  const [estudiantes, setEstudiantes] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [alerta, setAlerta] = useState({ tipo: "", texto: "" });
  const [busqueda, setBusqueda] = useState("");

  // comprobar que la API responde
  useEffect(() => {
    fetch(`${apiUrl}/api`)
      .then((res) => res.json())
      .then((data) => {
        setMensajeApi(data.message || "API ok");
        setEstadoApi("Conectado");
      })
      .catch(() => {
        setMensajeApi("No se pudo conectar con la API");
        setEstadoApi("Desconectado");
      });
  }, []);

  const cargarEstudiantes = () => {
    fetch(`${apiUrl}/api/estudiantes`)
      .then((res) => res.json())
      .then((data) => {
        setEstudiantes(data);
        setFiltrados(data);
        setAlerta({ tipo: "", texto: "" });
      })
      .catch(() => {
        setAlerta({
          tipo: "error",
          texto: "No se pudo cargar la lista de estudiantes",
        });
      });
  };

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const manejarGuardar = (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setAlerta({ tipo: "error", texto: "El nombre es obligatorio" });
      return;
    }

    fetch(`${apiUrl}/api/estudiantes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, correo }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al crear");
        return res.json();
      })
      .then(() => {
        setAlerta({ tipo: "ok", texto: "Estudiante guardado" });
        setNombre("");
        setCorreo("");
        cargarEstudiantes();
      })
      .catch(() =>
        setAlerta({ tipo: "error", texto: "No se pudo crear el estudiante" })
      );
  };

  const manejarEliminar = (id) => {
    const confirmar = window.confirm("¿Eliminar este estudiante?");
    if (!confirmar) return;

    fetch(`${apiUrl}/api/estudiantes/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar");
        setAlerta({ tipo: "ok", texto: "Estudiante eliminado" });
        cargarEstudiantes();
      })
      .catch(() =>
        setAlerta({ tipo: "error", texto: "No se pudo eliminar" })
      );
  };

  const manejarBusqueda = (valor) => {
    setBusqueda(valor);
    const texto = valor.toLowerCase();
    const res = estudiantes.filter(
      (e) =>
        e.nombre.toLowerCase().includes(texto) ||
        (e.correo || "").toLowerCase().includes(texto)
    );
    setFiltrados(res);
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="logo">Proyecto Fullstack</div>
        <div className="api-pill">API: {apiUrl}</div>
      </header>

      <main className="contenido">
        <div className="titulo-bloque">
          <h1>Panel de estudiantes</h1>
          <span className={estadoApi === "Conectado" ? "badge-ok" : "badge-bad"}>
            {estadoApi}
          </span>
        </div>

        {alerta.texto && (
          <div
            className={
              alerta.tipo === "ok" ? "alert alert-success" : "alert alert-error"
            }
          >
            {alerta.texto}
          </div>
        )}

        <section className="grid">
          <div className="card metric">
            <p>Total estudiantes</p>
            <h2>{estudiantes.length}</h2>
          </div>
          <div className="card metric">
            <p>Mostrando</p>
            <h2>{filtrados.length}</h2>
          </div>
          <div className="card metric">
            <p>Mensaje API</p>
            <h2 className="mensaje-api">{mensajeApi}</h2>
          </div>
        </section>

        <section className="panel">
          <div className="card form-card">
            <h2>Nuevo estudiante</h2>
            <p className="texto-ayuda">
              Agrega un alumno y se guardará en el backend de Railway.
            </p>
            <form onSubmit={manejarGuardar}>
              <label>Nombre *</label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Adrián Bravo"
              />

              <label>Correo</label>
              <input
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="Ej. adrian@correo.com"
              />

              <button type="submit" className="btn-primario">
                Guardar
              </button>
            </form>
          </div>

          <div className="card lista-card">
            <div className="lista-header">
              <h2>Listado de estudiantes</h2>
              <input
                value={busqueda}
                onChange={(e) => manejarBusqueda(e.target.value)}
                placeholder="Buscar por nombre o correo..."
              />
            </div>

            <div className="tabla-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="sin-datos">
                        No hay estudiantes o no coincide la búsqueda.
                      </td>
                    </tr>
                  ) : (
                    filtrados.map((e) => (
                      <tr key={e.id}>
                        <td>{e.id}</td>
                        <td>{e.nombre}</td>
                        <td>{e.correo || "-"}</td>
                        <td>
                          <button
                            onClick={() => manejarEliminar(e.id)}
                            className="btn-borrar"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
