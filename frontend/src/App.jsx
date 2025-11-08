import { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  // URL de la API (de Vercel usará el .env de Vercel, en local tu .env)
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [estudiantes, setEstudiantes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensajeOk, setMensajeOk] = useState("");
  const [apiOK, setApiOK] = useState(false);

  // cargar lista inicial
  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      setError("");
      try {
        // 1. comprobar que la API responde
        const ping = await fetch(`${apiBase}/api`);
        if (!ping.ok) throw new Error("No se pudo conectar con la API");
        setApiOK(true);

        // 2. pedir estudiantes
        const res = await fetch(`${apiBase}/api/estudiantes`);
        if (!res.ok) throw new Error("No se pudo cargar la lista");
        const data = await res.json();
        setEstudiantes(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        setApiOK(false);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [apiBase]);

  // lista filtrada
  const listaFiltrada = useMemo(() => {
    if (!busqueda.trim()) return estudiantes;
    const term = busqueda.toLowerCase();
    return estudiantes.filter(
      (e) =>
        e.nombre?.toLowerCase().includes(term) ||
        e.correo?.toLowerCase().includes(term)
    );
  }, [busqueda, estudiantes]);

  // crear estudiante
  const crearEstudiante = async (e) => {
    e.preventDefault();
    setError("");
    setMensajeOk("");

    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    try {
      const res = await fetch(`${apiBase}/api/estudiantes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          correo: correo.trim(),
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "No se pudo crear el estudiante");
      }

      const nuevo = await res.json(); // el backend devuelve {ok:true, estudiante:{...}} o el obj directo
      // según tu backend de ejemplo (el que hicimos en VSCode) el POST devolvía { ok: true, estudiante }
      const est = nuevo.estudiante || nuevo;

      setEstudiantes((prev) => [...prev, est]);
      setNombre("");
      setCorreo("");
      setMensajeOk("Estudiante guardado ?");
    } catch (err) {
      setError(err.message);
    }
  };

  // eliminar
  const eliminarEstudiante = async (id) => {
    const confirmar = window.confirm("¿Eliminar este estudiante?");
    if (!confirmar) return;

    try {
      const res = await fetch(`${apiBase}/api/estudiantes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("No se pudo eliminar");
      setEstudiantes((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      {/* Barra superior */}
      <header className="topbar">
        <div className="brand">Proyecto Fullstack</div>
        <div className="api-url">
          API: <span>{apiBase}</span>
        </div>
      </header>

      {/* Alertas */}
      <div className="container">
        {error && <div className="alert alert-error">{error}</div>}
        {mensajeOk && <div className="alert alert-success">{mensajeOk}</div>}

        {/* Encabezado */}
        <div className="header-title">
          <h1>
            Frontend React <span className="badge">?</span>
          </h1>
          <p>
            Respuesta del backend (/api):{" "}
            <strong>
              {apiOK ? "API de Estudiantes funcionando ?" : "No conectado"}
            </strong>
          </p>
          <p className="small">URL usada: {apiBase}/api</p>
        </div>

        {/* Cards de resumen */}
        <div className="cards">
          <div className="card">
            <p>Total estudiantes</p>
            <h2>{estudiantes.length}</h2>
          </div>
          <div className="card">
            <p>Mostrando</p>
            <h2>{listaFiltrada.length}</h2>
          </div>
          <div className="card">
            <p>Estado API</p>
            <span className={apiOK ? "chip chip-ok" : "chip chip-bad"}>
              {apiOK ? "Conectado" : "Desconectado"}
            </span>
          </div>
        </div>

        {/* Grid principal */}
        <div className="grid">
          {/* Formulario */}
          <div className="panel form-panel">
            <h2>Nuevo estudiante</h2>
            <p className="desc">Agrega un alumno y se guardará en Railway.</p>
            <form onSubmit={crearEstudiante}>
              <label>
                Nombre *
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Adrián Bravo"
                />
              </label>
              <label>
                Correo (opcional)
                <input
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="Ej. adrian@correo.com"
                />
              </label>
              <button type="submit" disabled={cargando}>
                {cargando ? "Cargando..." : "Guardar"}
              </button>
            </form>
          </div>

          {/* Tabla */}
          <div className="panel table-panel">
            <div className="table-header">
              <h2>Listado de estudiantes</h2>
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre o correo..."
              />
            </div>

            <div className="table-wrapper">
              {cargando ? (
                <p className="muted">Cargando...</p>
              ) : listaFiltrada.length === 0 ? (
                <p className="muted">
                  No hay estudiantes o no coincide la búsqueda.
                </p>
              ) : (
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
                    {listaFiltrada.map((est) => (
                      <tr key={est.id}>
                        <td>{est.id}</td>
                        <td>{est.nombre}</td>
                        <td>{est.correo || "—"}</td>
                        <td>
                          <button
                            className="btn-delete"
                            onClick={() => eliminarEstudiante(est.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
