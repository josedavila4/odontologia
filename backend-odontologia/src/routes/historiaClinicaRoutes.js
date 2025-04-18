const express = require("express");
const router = express.Router();

const {
  guardarHistoriaClinica,
  obtenerHistoriaClinica
} = require("../controllers/historiaClinicaController");

router.post("/:subdominio/:cedula", guardarHistoriaClinica);
router.get("/:subdominio/:cedula", (req, res, next) => {
  console.log("📥 Subdominio recibido:", req.params.subdominio);
  console.log("📥 Cédula recibida:", req.params.cedula);
  next();
}, obtenerHistoriaClinica);


module.exports = router;
