// src/controllers/historiaClinicaController.js
const pool = require("../models/database");

exports.guardarHistoriaClinica = async (req, res) => {
  try {
    const { subdominio, cedula } = req.params;
    const { historiaClinica } = req.body;

    // 🔍 Buscar el ID del consultorio por subdominio
    const consultorio = await pool.query(
      "SELECT id FROM consultorios WHERE subdominio = $1",
      [subdominio]
    );

    if (consultorio.rows.length === 0) {
      return res.status(404).json({ mensaje: "Consultorio no encontrado" });
    }

    const consultorio_id = consultorio.rows[0].id;

    // 🔍 Confirmar que el paciente existe
    const paciente = await pool.query(
      "SELECT cedula FROM pacientes WHERE cedula = $1 AND consultorio_id = $2",
      [cedula, consultorio_id]
    );

    if (paciente.rows.length === 0) {
      return res.status(404).json({ mensaje: "Paciente no encontrado" });
    }

    // 🧹 Eliminar historia previa del paciente
    await pool.query(
      "DELETE FROM historias_clinicas WHERE paciente_id = $1 AND consultorio_id = $2",
      [cedula, consultorio_id]
    );

    // 🦷 Insertar nueva historia por cada diente
    for (const entrada of historiaClinica) {
      const { diente, tratamiento, presente } = entrada;

      await pool.query(
        `INSERT INTO historias_clinicas 
        (paciente_id, consultorio_id, diente, tratamiento, diagnostico)
        VALUES ($1, $2, $3, $4, $5)`,
        [
          cedula,
          consultorio_id,
          diente,
          tratamiento || "",
          presente ? "" : "Ausente"
        ]
      );
    }

    res.status(200).json({ mensaje: "Historia clínica guardada correctamente" });

  } catch (error) {
    console.error("❌ Error en guardarHistoriaClinica:", error);
    res.status(500).json({ mensaje: "Error al guardar historia clínica" });
  }
};
exports.obtenerHistoriaClinica = async (req, res) => {
  try {
    const { subdominio, cedula } = req.params;

    // Obtener el consultorio
    const consultorio = await pool.query(
      "SELECT id FROM consultorios WHERE subdominio = $1",
      [subdominio]
    );

    if (consultorio.rows.length === 0) {
      return res.status(404).json({ mensaje: "Consultorio no encontrado" });
    }

    const consultorio_id = consultorio.rows[0].id;

    // Buscar la historia clínica del paciente por cédula
    const resultado = await pool.query(
      "SELECT diente, tratamiento, diagnostico FROM historias_clinicas WHERE paciente_id = $1 AND consultorio_id = $2",
      [cedula, consultorio_id]
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error("❌ Error en obtenerHistoriaClinica:", error);
    res.status(500).json({ mensaje: "Error al obtener historia clínica" });
  }
};