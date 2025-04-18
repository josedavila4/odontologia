const pool = require("../models/database");

const obtenerPacientesPorConsultorio = async (req, res) => {
  const { subdominio } = req.params;

  try {
    const consultorio = await pool.query(
      "SELECT id FROM consultorios WHERE subdominio = $1",
      [subdominio]
    );

    if (consultorio.rows.length === 0) {
      return res.status(404).json({ mensaje: "Consultorio no encontrado" });
    }

    const consultorio_id = consultorio.rows[0].id;

    const pacientes = await pool.query(
      "SELECT * FROM pacientes WHERE consultorio_id = $1",
      [consultorio_id]
    );

    res.json(pacientes.rows);
  } catch (error) {
    console.error("❌ Error al obtener pacientes:", error);
    res.status(500).json({ mensaje: "Error al obtener pacientes" });
  }
};

const obtenerPacientePorCedula = async (req, res) => {
  const { subdominio, cedula } = req.params;

  try {
    const consultorio = await pool.query(
      "SELECT id FROM consultorios WHERE subdominio = $1",
      [subdominio]
    );

    if (consultorio.rows.length === 0) {
      return res.status(404).json({ mensaje: "Consultorio no encontrado" });
    }

    const consultorio_id = consultorio.rows[0].id;

    const resultado = await pool.query(
      "SELECT * FROM pacientes WHERE cedula = $1 AND consultorio_id = $2",
      [cedula, consultorio_id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "Paciente no encontrado" });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener paciente por cédula:", error);
    res.status(500).json({ mensaje: "Error al obtener paciente" });
  }
};


const crearPaciente = async (req, res) => {
  // Por implementar
  res.json({ mensaje: "crearPaciente aún no implementado" });
};

const actualizarPaciente = async (req, res) => {
  // Por implementar
  res.json({ mensaje: "actualizarPaciente aún no implementado" });
};

const eliminarPaciente = async (req, res) => {
  // Por implementar
  res.json({ mensaje: "eliminarPaciente aún no implementado" });
};

module.exports = {
  obtenerPacientesPorConsultorio,
  obtenerPacientePorCedula,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente,
};
