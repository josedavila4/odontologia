// src/controllers/pacienteController.js
const pool = require("../models/database");

exports.obtenerPacientesPorConsultorio = async (req, res) => {
  try {
    const { subdominio } = req.params;

    const consultorio = await pool.query(
      "SELECT id FROM consultorios WHERE subdominio = $1",
      [subdominio]
    );

    if (consultorio.rows.length === 0) {
      return res.status(404).json({ mensaje: "Consultorio no encontrado" });
    }

    const consultorioId = consultorio.rows[0].id;

    const resultado = await pool.query(
      "SELECT * FROM pacientes WHERE consultorio_id = $1",
      [consultorioId]
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error("❌ Error en obtenerPacientesPorConsultorio:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

exports.obtenerPacientePorCedula = async (req, res) => {
  try {
    const { subdominio, cedula } = req.params;

    // Buscar el consultorio por subdominio
    const consultorio = await pool.query(
      "SELECT id FROM consultorios WHERE subdominio = $1",
      [subdominio]
    );

    if (consultorio.rows.length === 0) {
      return res.status(404).json({ mensaje: "Consultorio no encontrado" });
    }

    const consultorioId = consultorio.rows[0].id;

    // Obtener datos del paciente
    const pacienteResult = await pool.query(
      "SELECT * FROM pacientes WHERE cedula = $1 AND consultorio_id = $2",
      [cedula, consultorioId]
    );

    if (pacienteResult.rows.length === 0) {
      return res.status(404).json({ mensaje: "Paciente no encontrado" });
    }

    const paciente = pacienteResult.rows[0];

    // Obtener historia clínica
    const historiaResult = await pool.query(
      "SELECT diente, tratamiento, diagnostico FROM historias_clinicas WHERE paciente_id = $1 AND consultorio_id = $2",
      [cedula, consultorioId]
    );

    paciente.historiaClinica = historiaResult.rows;

    res.json(paciente);
  } catch (error) {
    console.error("❌ Error en obtenerPacientePorCedula:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};



exports.crearPaciente = async (req, res) => {
  const client = await pool.connect();

  try {
    const { subdominio } = req.params;
    const { nombre, cedula, telefono, correo } = req.body;

    // Obtener consultorio
    const consultorio = await client.query(
      "SELECT id FROM consultorios WHERE subdominio = $1",
      [subdominio]
    );

    if (consultorio.rows.length === 0) {
      return res.status(404).json({ mensaje: "Consultorio no encontrado" });
    }

    const consultorioId = consultorio.rows[0].id;

    await client.query("BEGIN");

    // Insertar paciente
    const nuevo = await client.query(
      "INSERT INTO pacientes (nombre, cedula, telefono, correo, consultorio_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nombre, cedula, telefono, correo, consultorioId]
    );

    // Insertar los 32 dientes por defecto
    const dientes = [
      ...Array.from({ length: 8 }, (_, i) => `1${i + 1}`),
      ...Array.from({ length: 8 }, (_, i) => `2${i + 1}`),
      ...Array.from({ length: 8 }, (_, i) => `3${i + 1}`),
      ...Array.from({ length: 8 }, (_, i) => `4${i + 1}`),
    ];

    for (const numeroDiente of dientes) {
      await client.query(
        `INSERT INTO historias_clinicas 
         (paciente_id, consultorio_id, diente, tratamiento, diagnostico, presente) 
         VALUES ($1, $2, $3, '', '', true)`,
        [cedula, consultorioId, numeroDiente]
      );
    }

    await client.query("COMMIT");

    res.status(201).json(nuevo.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error en crearPaciente:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  } finally {
    client.release();
  }
};


exports.actualizarPaciente = async (req, res) => {
  try {
    const { subdominio, id } = req.params;
    const { nombre, cedula, telefono, correo } = req.body;

    const resultado = await pool.query(
      "UPDATE pacientes SET nombre=$1, cedula=$2, telefono=$3, correo=$4 WHERE cedula=$5 RETURNING *",
      [nombre, cedula, telefono, correo, id]
    );

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error("❌ Error en actualizarPaciente:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

exports.eliminarPaciente = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM pacientes WHERE cedula = $1", [id]);

    res.sendStatus(204);
  } catch (error) {
    console.error("❌ Error en eliminarPaciente:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};
