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
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.mensaje);

      const token = data.token;
      localStorage.setItem("token", token);

      const decodedToken = JSON.parse(atob(token.split(".")[1]));

      // Redirección basada en rol
      if (decodedToken.rol === "admin") {
        navigate("/admin"); // 👈 Panel del administrador
      } else {
        navigate(`/home/${decodedToken.subdominio}`); // 👈 Otros usuarios
      }
    } catch (error) {
      console.error("❌ Error en login:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: isSmallScreen ? "none" : "url('/wave-bg.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        backgroundColor: isSmallScreen ? "#fff" : "linear-gradient(145deg, #a4f9ef 0%, #fff 100%)",
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
            backgroundColor: isSmallScreen ? "#fff" : "rgba(255,255,255,0.9)",
            borderRadius: 3,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "teal" }}>
            <MedicalServicesIcon fontSize="large" />
          </Avatar>

          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Iniciar Sesión
          </Typography>

          {error && (
            <Typography color="error" sx={{ textAlign: "center", mb: 2 }}>
              {error}
            </Typography>
          )}

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
