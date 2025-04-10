const pool = require("../config/db");

const crearConsultorio = async (nombre, direccion, telefono) => {
  const query = `
    INSERT INTO consultorios (nombre, direccion, telefono)
    VALUES ($1, $2, $3) RETURNING *;
  `;
  const values = [nombre, direccion, telefono];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const obtenerConsultorios = async () => {
  const query = "SELECT * FROM consultorios";
  const { rows } = await pool.query(query);
  return rows;
};

module.exports = { crearConsultorio, obtenerConsultorios };
