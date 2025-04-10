const jwt = require("jsonwebtoken");
const pool = require("../models/database");

const verificarToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(403).json({ mensaje: "No autorizado: Token no proporcionado" });
    }

    // Verificar el token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔹 Token decodificado:", decoded);

    // Verificar si el usuario tiene un consultorio asignado
    const consultorio = await pool.query(
      "SELECT id, nombre FROM consultorios WHERE id = $1",
      [decoded.consultorio_id]
    );

    if (consultorio.rows.length === 0) {
      return res.status(403).json({ mensaje: "No autorizado: Consultorio no encontrado" });
    }

    req.usuario = decoded;
    req.consultorioNombre = consultorio.rows[0]?.nombre;
    next();
  } catch (error) {
    console.error("🔴 Error en autenticación:", error.message);
    res.status(403).json({ mensaje: "Token inválido o expirado" });
  }
};

module.exports = verificarToken;
