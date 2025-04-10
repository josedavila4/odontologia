const pool = require("../config/db");

const crearUsuario = async (nombre, correo, contraseña, rol, consultorio_id) => {
  const hashedPassword = await require("bcryptjs").hash(contraseña, 10);
  const query = `
    INSERT INTO usuarios (nombre, correo, contraseña, rol, consultorio_id)
    VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, correo, rol, creado_en;
  `;
  const values = [nombre, correo, hashedPassword, rol, consultorio_id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const obtenerUsuarioPorCorreo = async (correo) => {
  const query = "SELECT * FROM usuarios WHERE correo = $1";
  const { rows } = await pool.query(query, [correo]);
  return rows[0];
};

module.exports = { crearUsuario, obtenerUsuarioPorCorreo };
