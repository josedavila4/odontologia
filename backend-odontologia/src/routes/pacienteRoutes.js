const express = require("express");
const router = express.Router();
const {
  obtenerPacientePorCedula,
  obtenerPacientesPorConsultorio,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente,
} = require("../controllers/pacienteController");

router.get("/api/pacientes/:subdominio", obtenerPacientesPorConsultorio);
router.get("/api/pacientes/:subdominio/:cedula", obtenerPacientePorCedula);
router.post("/api/pacientes/:subdominio", crearPaciente);
router.put("/api/pacientes/:subdominio/:cedula", actualizarPaciente);
router.delete("/api/pacientes/:subdominio/:cedula", eliminarPaciente);

module.exports = router;
