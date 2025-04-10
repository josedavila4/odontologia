import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices"; // 🔹 Ejemplo de ícono “servicios médicos”

export default function Login() {
  console.log("🟢 Login cargado");

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Responsividad
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("🟢 Botón de login presionado");
    setError("");
    setLoading(true);

    if (!correo.includes("@")) {
      setError("Correo inválido");
      setLoading(false);
      return;
    }
    if (contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      console.log("📤 Enviando datos:", { correo, contrasena });

      const response = await fetch("http://localhost:5000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });

      console.log("📥 Respuesta recibida:", response);

      const data = await response.json();
      console.log("📥 Datos del backend:", data);

      if (!response.ok) throw new Error(data.mensaje);

      localStorage.setItem("token", data.token);
      const decodedToken = JSON.parse(atob(data.token.split(".")[1]));

      // Redirecciones
      if (decodedToken.rol === "msu") {
        navigate("/seleccionar-consultorio");
      } else if (decodedToken.rol === "admin") {
        navigate(`/home/${decodedToken.subdominio}`);
      } else {
        navigate(`/home/${decodedToken.subdominio}`);
      }
    } catch (error) {
      console.error("❌ Error en el login:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        // 💡 Imagen “wave” o gradiente
        backgroundImage: isSmallScreen
          ? "none"
          : "url('/wave-bg.png')", // Reemplázalo por la tuya, o un gradiente
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        // Color de fondo degradado
        backgroundColor: isSmallScreen
          ? "#fff"
          : "linear-gradient(145deg, #a4f9ef 0%, #fff 100%)",
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={isSmallScreen ? 2 : 6}
          sx={{
            p: 4,
            mt: isSmallScreen ? 8 : 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backdropFilter: isSmallScreen ? "none" : "blur(6px)",
            backgroundColor: isSmallScreen
              ? "#fff"
              : "rgba(255,255,255,0.9)",
            borderRadius: 3,
          }}
        >
          {/* Ícono principal (simboliza servicios dentales) */}
          <Avatar sx={{ m: 1, bgcolor: "teal" }}>
            <MedicalServicesIcon fontSize="large" />
          </Avatar>

          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Iniciar Sesión
          </Typography>

          {/* Mensaje de error si hay */}
          {error && (
            <Typography color="error" sx={{ textAlign: "center", mb: 2 }}>
              {error}
            </Typography>
          )}

          {/* Formulario */}
          <Box component="form" onSubmit={handleLogin} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              fullWidth
              label="Correo electrónico"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
            <TextField
              margin="normal"
              fullWidth
              label="Contraseña"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontWeight: "bold", bgcolor: "teal" }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Iniciar sesión"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
