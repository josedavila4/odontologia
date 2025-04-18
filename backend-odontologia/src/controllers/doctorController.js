const pool = require("../models/database");

// Crear un nuevo doctor
exports.crearDoctor = async (req, res) => {
  const { nombre, telefono, correo, fecha_nacimiento, consultorio_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO doctores (nombre, telefono, correo, fecha_nacimiento, consultorio_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, telefono, correo, fecha_nacimiento, consultorio_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error creando doctor:", error);
    res.status(500).json({ error: "Error al crear el doctor" });
  }
};

// Listar todos los doctores de un consultorio
exports.listarDoctores = async (req, res) => {
  const { consultorio_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, nombre, telefono, correo, fecha_nacimiento
       FROM doctores WHERE consultorio_id = $1`,
      [consultorio_id]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error listando doctores:", error);
    res.status(500).json({ error: "Error al listar doctores" });
  }
};
