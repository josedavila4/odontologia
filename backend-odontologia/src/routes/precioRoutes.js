const express = require("express");
const router = express.Router();
const verificarToken = require("../middleware/verificarToken");
const { crearPrecio, listarPrecios } = require("../controllers/precioController");

router.post("/crear", verificarToken, crearPrecio);
router.get("/listar", verificarToken, listarPrecios);

module.exports = router;
