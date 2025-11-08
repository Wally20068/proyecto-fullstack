require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// puerto desde .env o 3000
const PORT = process.env.PORT || 3000;

// ruta de prueba
app.get("/api", (req, res) => {
  res.json({ message: "API funcionando ?" });
});

// aquí puedes poner más rutas CRUD
// app.get("/api/usuarios", ...)

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
