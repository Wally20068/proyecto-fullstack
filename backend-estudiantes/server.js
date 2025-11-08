require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// datos en memoria (por ahora en RAM)
let estudiantes = [];
let idActual = 1;

// ruta de prueba
app.get('/api', (req, res) => {
  res.json({ message: 'API de Estudiantes funcionando ?' });
});

// listar estudiantes
app.get('/api/estudiantes', (req, res) => {
  res.json(estudiantes);
});

// crear estudiante
app.post('/api/estudiantes', (req, res) => {
  const { nombre, correo } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }

  const nuevo = {
    id: idActual++,
    nombre,
    correo: correo || ''
  };

  estudiantes.push(nuevo);
  res.status(201).json(nuevo);
});

// eliminar estudiante
app.delete('/api/estudiantes/:id', (req, res) => {
  const id = Number(req.params.id);
  const existe = estudiantes.some(e => e.id === id);

  if (!existe) {
    return res.status(404).json({ error: 'Estudiante no encontrado' });
  }

  estudiantes = estudiantes.filter(e => e.id !== id);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de Estudiantes escuchando en puerto ${PORT}`);
});
