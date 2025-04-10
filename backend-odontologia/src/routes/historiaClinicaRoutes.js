// src/routes/historiaClinicaRoutes.js
const express = require("express");
const router = express.Router();

const {
  guardarHistoriaClinica,
  obtenerHistoriaClinica // 👈 Asegúrate de tener esta línea
} = require("../controllers/historiaClinicaController");

router.post("/:subdominio/:cedula", guardarHistoriaClinica);
router.get("/:subdominio/:cedula", obtenerHistoriaClinica); // ✅ ahora sí existe

module.exports = router;
