const jwt = require("jsonwebtoken");
const pool = require("../models/database");

const verificarToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ mensaje: "No autorizado" });

    const decoded = jwt.verify(token, "SECRETO_SUPER_SEGURO");

    // 🔹 Verificar si el usuario tiene un consultorio asociado
    const usuario = await pool.query(
      "SELECT id, consultorio_id FROM usuarios WHERE id = $1",
      [decoded.id]
    );

    if (usuario.rows.length === 0 || !usuario.rows[0].consultorio_id) {
      return res.status(403).json({ mensaje: "Consultorio no especificado" });
    }

    req.usuario = {
      id: usuario.rows[0].id,
      consultorio_id: usuario.rows[0].consultorio_id,
    };

    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ mensaje: "Token inválido" });
  }
};

module.exports = verificarToken;
