const pool = require("../models/database");

const crearPrecio = async (req, res) => {
  try {
    const { tratamiento_id, precio } = req.body;
    const consultorio_id = req.usuario.consultorio_id;

    const existe = await pool.query(
      "SELECT * FROM precios_tratamientos WHERE tratamiento_id = $1 AND consultorio_id = $2",
      [tratamiento_id, consultorio_id]
    );

    if (existe.rows.length > 0) {
      return res.status(409).json({ mensaje: "Ya existe un precio registrado para este tratamiento." });
    }

    await pool.query(
      "INSERT INTO precios_tratamientos (tratamiento_id, consultorio_id, precio) VALUES ($1, $2, $3)",
      [tratamiento_id, consultorio_id, precio]
    );

    res.status(201).json({ mensaje: "Precio registrado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al guardar el precio" });
  }
};

const listarPrecios = async (req, res) => {
  const consultorio_id = req.usuario.consultorio_id;

  try {
    const result = await pool.query(
      `SELECT pt.precio, t.nombre AS tratamiento
       FROM precios_tratamientos pt
       JOIN tratamientos t ON pt.tratamiento_id = t.id
       WHERE pt.consultorio_id = $1`,
      [consultorio_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener precios:", error);
    res.status(500).json({ mensaje: "Error al obtener precios" });
  }
};

module.exports = {
  crearPrecio,
  listarPrecios,
};
