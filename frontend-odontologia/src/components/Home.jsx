import { useEffect, useState } from "react";
import {
  Container, Typography, Button, Paper, Box, AppBar, Toolbar, IconButton, Avatar,
  Popover, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@mui/material";
import { Logout, AccountCircle, Settings } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [subdominio, setsubdominio] = useState(null);
  const [nombreConsultorio, setNombreConsultorio] = useState("Consultorio");
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [usuario, setUsuario] = useState({ rol: "", subdominio: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        console.log("📡 Token decodificado:", decodedToken);
        setUsuario({ rol: decodedToken.rol, subdominio: decodedToken.subdominio });

        if (decodedToken.subdominio) {
          setsubdominio(decodedToken.subdominio);
        } else {
          console.error("⚠ No se encontró subdominio en el token.");
        }
      } catch (error) {
        console.error("❌ Error decodificando el token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (subdominio) {
      console.log(`📡 Cargando datos de consultorio: ${subdominio}`);
      fetch(`http://localhost:5000/api/consultorios/${subdominio}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.nombre) {
            setNombreConsultorio(data.nombre);
          } else {
            console.error("❌ Respuesta inesperada de la API:", data);
          }
        })
        .catch((error) => console.error("❌ Error obteniendo consultorio:", error));
    }
  }, [subdominio]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleProfileOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutDialogOpen = () => {
    setOpenLogoutDialog(true);
  };

  const handleLogoutDialogClose = () => {
    setOpenLogoutDialog(false);
  };

  return (
    <Box sx={{ backgroundImage: "url('/background.jpg')", backgroundSize: "cover", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            {nombreConsultorio}
          </Typography>

          {/* Icono para panel admin */}
          {["admin", "msu"].includes(usuario?.rol) && (
            <IconButton color="inherit" onClick={() => navigate("/admin")}>
              <Settings />
            </IconButton>
          )}

          <IconButton color="inherit" onClick={handleProfileOpen}>
            <AccountCircle />
          </IconButton>

          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleProfileClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            sx={{ mt: 1 }}
          >
            <Box sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                <AccountCircle fontSize="large" />
              </Avatar>
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                Mi Perfil
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <IconButton
                  onClick={() => {
                    handleProfileClose();
                    navigate("/perfil");
                  }}
                  sx={{ bgcolor: "#f0f0f0", p: 2, borderRadius: 2 }}
                >
                  <AccountCircle fontSize="large" />
                </IconButton>
                <IconButton
                  onClick={() => {
                    handleProfileClose();
                    navigate("/configuracion");
                  }}
                  sx={{ bgcolor: "#f0f0f0", p: 2, borderRadius: 2 }}
                >
                  <Settings fontSize="large" />
                </IconButton>
              </Box>
            </Box>
          </Popover>

          <IconButton color="inherit" onClick={handleLogoutDialogOpen}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Dialog open={openLogoutDialog} onClose={handleLogoutDialogClose}>
        <DialogTitle>¿Cerrar sesión?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas cerrar sesión? Perderás el acceso hasta volver a iniciar sesión.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutDialogClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleLogout} color="error">
            Salir
          </Button>
        </DialogActions>
      </Dialog>

      <Container component="main" maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 8,
            textAlign: "center",
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.8)",
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Bienvenido a {nombreConsultorio}
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Aquí puedes gestionar pacientes, citas, presupuestos y más.
          </Typography>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/consultorio/${subdominio}/pacientes`)}
            >
              Gestionar Pacientes
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate(`/consultorio/${subdominio}/citas`)}
            >
              Ver Citas
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate(`/consultorio/${subdominio}/presupuesto`)}
            >
              Presupuestos
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
