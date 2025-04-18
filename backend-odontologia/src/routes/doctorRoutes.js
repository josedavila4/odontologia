const express = require("express");
const router = express.Router();
const { crearDoctor, listarDoctores } = require("../controllers/doctorController");

// Crear un doctor
router.post("/crear", crearDoctor);

// Listar doctores por consultorio
router.get("/listar/:consultorio_id", listarDoctores);

module.exports = router;
