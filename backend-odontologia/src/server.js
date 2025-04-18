require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Inicializar app
const app = express();
app.use(express.json());
app.use(cors());

// 🔹 Variables de entorno cargadas
console.log("🔹 Variables de entorno cargadas:", process.env.DB_USER);

// Importar rutas
const usuarioRoutes = require("./routes/usuarioRoutes");
const consultorioRoutes = require("./routes/consultorioRoutes");
const pacienteRoutes = require(path.join(__dirname, "routes", "pacienteRoutes"));
const verificarSubdominio = require("./middleware/subdominioMiddleware");

// Middleware para detectar subdominios
app.use(verificarSubdominio);

// Definir rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/consultorios", consultorioRoutes);
app.use("/api/pacientes", pacienteRoutes); // ✅ Asegura que el prefijo sea correcto

// Ruta principal
app.get("/", (req, res) => {
  if (req.subdominio === "administrador") {
    res.send("Panel de administrador");
  } else {
    res.send(`Bienvenido al consultorio ${req.subdominio}`);
  }
});

// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

const historiaClinicaRoutes = require("./routes/historiaClinicaRoutes");
app.use("/api/historia-clinica", historiaClinicaRoutes);
console.log("📦 historiaClinicaRoutes cargado");

const precioRoutes = require("./routes/precioRoutes");
app.use("/api/precios", precioRoutes);

const tratamientoRoutes = require("./routes/tratamientoRoutes");
app.use("/api/tratamientos", tratamientoRoutes);

const doctorRoutes = require("./routes/doctorRoutes");
app.use("/api/doctores", doctorRoutes);

