const pool = require("../db");

exports.obtenerHistoriaClinica = async (req, res) => {
  try {
    const { subdominio, cedula } = req.params;

    const consultorio = await pool.query(
      "SELECT id FROM consultorios WHERE subdominio = $1",
      [subdominio]
    );
    if (consultorio.rows.length === 0) {
      return res.status(404).json({ mensaje: "Consultorio no encontrado" });
    }

    const consultorio_id = consultorio.rows[0].id;

    const resultado = await pool.query(
      `SELECT diente, tratamiento_texto AS tratamiento, presente
       FROM historias_clinicas
       WHERE paciente_id = $1 AND consultorio_id = $2`,
      [cedula, consultorio_id]
    );

    const dientesMap = {};

    resultado.rows.forEach(({ diente, tratamiento, presente }) => {
      if (!dientesMap[diente]) {
        dientesMap[diente] = { diente, tratamientos: [], presente: false };
      }
      if (tratamiento && !dientesMap[diente].tratamientos.includes(tratamiento)) {
        dientesMap[diente].tratamientos.push(tratamiento);
      }
      if (presente) {
        dientesMap[diente].presente = true;
      }
    });

    const historiaConsolidada = Object.values(dientesMap);

    console.log("📤 Historia consolidada:", historiaConsolidada);
    res.json(historiaConsolidada);
  } catch (error) {
    console.error("❌ Error al obtener historia clínica:", error);
    res.status(500).json({ mensaje: "Error al obtener historia clínica" });
  }
};

exports.guardarHistoriaClinica = async (req, res) => {
  try {
    const { subdominio, cedula } = req.params;
    const { historiaClinica } = req.body;

    const consultorio = await pool.query(
      "SELECT id FROM consultorios WHERE subdominio = $1",
      [subdominio]
    );
    if (consultorio.rows.length === 0) {
      return res.status(404).json({ mensaje: "Consultorio no encontrado" });
    }

    const consultorio_id = consultorio.rows[0].id;

    await pool.query(
      "DELETE FROM historias_clinicas WHERE paciente_id = $1 AND consultorio_id = $2",
      [cedula, consultorio_id]
    );

    for (const { diente, tratamiento, presente } of historiaClinica) {
      await pool.query(
        `INSERT INTO historias_clinicas (
          paciente_id, consultorio_id, diente, tratamiento_texto, presente
        ) VALUES ($1, $2, $3, $4, $5)`,
        [cedula, consultorio_id, diente, tratamiento, presente]
      );
    }

    res.status(200).json({ mensaje: "Historia clínica guardada correctamente" });
  } catch (error) {
    console.error("❌ Error al guardar historia clínica:", error);
    res.status(500).json({ mensaje: "Error al guardar historia clínica" });
  }
};
