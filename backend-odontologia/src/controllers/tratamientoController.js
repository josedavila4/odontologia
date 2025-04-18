const pool = require("../models/database");

exports.crearTratamiento = async (req, res) => {
  const { nombre } = req.body;
  try {
    const result = await pool.query("INSERT INTO tratamientos (nombre) VALUES ($1) RETURNING *", [nombre]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error al crear tratamiento:", error);
    res.status(500).json({ mensaje: "Error al crear tratamiento" });
  }
};

exports.listarTodosLosTratamientos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tratamientos ORDER BY nombre ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener tratamientos:", error);
    res.status(500).json({ mensaje: "Error al obtener tratamientos" });
  }
};
