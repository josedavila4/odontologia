const express = require("express");
const router = express.Router();
const pool = require("../models/database");

// ✅ Obtener todos los consultorios con `subdominio`
router.get("/", async (req, res) => {
    try {
        const resultado = await pool.query("SELECT id, nombre, subdominio FROM consultorios");
        res.json(resultado.rows);
    } catch (error) {
        console.error("❌ Error obteniendo consultorios:", error);
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
});

// ✅ Obtener un consultorio por `subdominio`
router.get("/:subdominio", async (req, res) => {
    try {
        const { subdominio } = req.params;
        const resultado = await pool.query("SELECT id, nombre, subdominio FROM consultorios WHERE subdominio = $1", [subdominio]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: "Consultorio no encontrado" });
        }

        res.json(resultado.rows[0]);
    } catch (error) {
        console.error("❌ Error obteniendo el consultorio:", error);
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
});

module.exports = router;
