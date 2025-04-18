const express = require("express");
const router = express.Router();
const { crearTratamiento, listarTodosLosTratamientos } = require("../controllers/tratamientoController");

router.post("/crear", crearTratamiento);
router.get("/todos", listarTodosLosTratamientos); // ✅ Añade esta línea

module.exports = router;

