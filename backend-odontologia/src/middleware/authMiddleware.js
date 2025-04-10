const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ mensaje: "Acceso denegado, token no proporcionado" });
    }

    try {
        const verificado = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = verificado;

        console.log("📌 Usuario autenticado en middleware:", req.user); // 🔹 Verificar qué datos tiene

        if (!req.user.consultorio_id) {
            return res.status(403).json({ mensaje: "No autorizado: consultorio no definido en token" });
        }

        next();
    } catch (error) {
        return res.status(400).json({ mensaje: "Token inválido" });
    }
};

module.exports = verificarToken;
