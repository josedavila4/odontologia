// usuarioController.js
const pool = require("../models/database"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



exports.loginUsuario = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        // 🔹 Consulta con JOIN para obtener también el subdominio:


const resultado = await pool.query(`
SELECT u.id, u.correo, u.password, u.rol, u.consultorio_id,
       c.subdominio
FROM usuarios u
LEFT JOIN consultorios c ON c.id = u.consultorio_id
WHERE u.correo = $1


`, [correo]);

        if (resultado.rows.length === 0) {
            return res.status(401).json({ mensaje: "Correo no registrado" });
        }

        const usuario = resultado.rows[0];

        const esValida = await bcrypt.compare(contrasena, usuario.password);
        if (!esValida) {
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });
        }

        // 🔹 Incluir subdominio en el token
const token = jwt.sign({
  id: usuario.id,
  correo: usuario.correo,
  rol: usuario.rol,
  consultorio_id: usuario.consultorio_id,
  subdominio: usuario.subdominio, // 🔹 IMPORTANTE
}, process.env.JWT_SECRET, { expiresIn: "1h" });


        res.json({ mensaje: "Inicio de sesión exitoso", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error en el servidor", error: error.message });
    }
};
