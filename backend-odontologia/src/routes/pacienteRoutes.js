// src/routes/pacienteRoutes.js
const express = require("express");
const router = express.Router();

const {
  obtenerPacientesPorConsultorio,
  obtenerPacientePorCedula,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente,
} = require("../controllers/pacienteController");

// Listar todos los pacientes del consultorio
router.get("/:subdominio", obtenerPacientesPorConsultorio);

// Obtener un paciente por cédula
router.get("/:subdominio/:cedula", obtenerPacientePorCedula);

// Crear nuevo paciente
router.post("/:subdominio", crearPaciente);

// Actualizar paciente
router.put("/:subdominio/:cedula", actualizarPaciente);

// Eliminar paciente
router.delete("/:subdominio/:cedula", eliminarPaciente);

module.exports = router;
