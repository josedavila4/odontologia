const bcrypt = require("bcrypt");

const encriptarContrasena = async () => {
    const passwordPlano = "Daiana0502smile!"; // Coloca aquí la contraseña en texto plano
    const saltRounds = 10;

    try {
        const hash = await bcrypt.hash(passwordPlano, saltRounds);
        console.log("Contraseña encriptada:", hash);
    } catch (error) {
        console.error("Error al encriptar:", error);
    }
};

encriptarContrasena();
