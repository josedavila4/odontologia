const jwt = require("jsonwebtoken");
const pool = require("../models/database"); // ajusta si tu pool está en otro lugar
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const resultado = await pool.query(
      "SELECT * FROM usuarios WHERE correo = $1",
      [correo]
    );

    if (resultado.rows.length === 0) {
      return res.status(400).json({ mensaje: "Usuario no encontrado" });
    }

    const usuario = resultado.rows[0];

    const contrasenaValida = contrasena === usuario.password;

    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    // Obtener el subdominio del consultorio del usuario
    const consultorio = await pool.query(
      "SELECT nombre FROM consultorios WHERE id = $1",
      [usuario.consultorio_id]
    );

    const subdominio = consultorio.rows[0]?.nombre || "default";

    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol,
        consultorio_id: usuario.consultorio_id,
        subdominio: subdominio
      },
      "SECRETO_SUPER_SEGURO", // usa process.env.JWT_SECRET si ya lo tienes en .env
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

module.exports = {
  login,
};
