import { useState, useEffect } from "react";
import axios from "axios";
import { FaUserMd } from "react-icons/fa";
import {
  AppBar, Toolbar, IconButton, Typography, Container, Paper, Avatar,
  TextField, MenuItem, Button, Box, Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import { Logout, Home, Add, Group, MonetizationOn } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function PanelAdministrador() {
  const [tratamientoId, setTratamientoId] = useState("");
  const [precio, setPrecio] = useState("");
  const [nuevoTratamiento, setNuevoTratamiento] = useState("");
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const [tratamientos, setTratamientos] = useState([]);
  const [usuario, setUsuario] = useState({ rol: "", subdominio: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = JSON.parse(atob(token.split(".")[1]));
    setUsuario({ rol: decoded.rol, subdominio: decoded.subdominio });

    axios.get("/api/tratamientos/todos")
      .then((res) => setTratamientos(res.data))
      .catch((err) => console.error("❌ Error cargando tratamientos:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "/api/precios/crear",
        {
          tratamiento_id: tratamientoId,
          precio: parseFloat(precio),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Precio guardado correctamente");
      setTratamientoId("");
      setPrecio("");
    } catch (error) {
      if (error.response?.status === 409) {
        alert("⚠️ Ya existe un precio registrado para ese tratamiento.");
      } else {
        alert("❌ Error al guardar precio");
        console.error(error);
      }
    }
  };

  const crearNuevoTratamiento = async () => {
    try {
      const res = await axios.post("/api/tratamientos/crear", { nombre: nuevoTratamiento });
      setTratamientos([...tratamientos, res.data]);
      setNuevoTratamiento("");
      setMostrarDialogo(false);
    } catch (error) {
      console.error("Error al crear tratamiento:", error);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Panel de Administración</Typography>
          <Box>
            <Button color="inherit" startIcon={<Home />} onClick={() => navigate("/home/" + usuario.subdominio)}>Ir a Home</Button>
            <IconButton color="inherit" onClick={() => { localStorage.clear(); navigate("/login"); }}>
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar sx={{ mr: 2 }}><FaUserMd /></Avatar>
            <Typography variant="body1">
              <strong>Usuario:</strong> {usuario.rol} — <strong>Consultorio:</strong> {usuario.subdominio}
            </Typography>
          </Box>

          {usuario.rol === "msu" && (
            <Button variant="contained" startIcon={<Add />} sx={{ mb: 3 }} onClick={() => alert("Funcionalidad de registrar consultorio solo para MSU")}>Registrar Consultorio</Button>
          )}

          <Box display="flex" justifyContent="space-between" mb={4}>
            <Button variant="contained" startIcon={<Group />} onClick={() => navigate("/registrar-doctor")}>Gestionar Doctores</Button>
            <Button variant="contained" startIcon={<MonetizationOn />} onClick={() => navigate("/gestionar-precios")}>Ver y Editar Precios</Button>
          </Box>

          <Typography variant="h6" gutterBottom>Registrar Precio de Tratamiento</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 2, mb: 4 }}>
            <TextField
              select
              label="Tratamiento"
              value={tratamientoId}
              onChange={(e) => setTratamientoId(e.target.value)}
              fullWidth
              required
            >
              {tratamientos.map((t) => (
                <MenuItem key={t.id} value={t.id}>{t.nombre}</MenuItem>
              ))}
            </TextField>

            <TextField
              label="Precio *"
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />

            <Button type="submit" variant="contained" color="success">GUARDAR PRECIO</Button>
            <Button variant="outlined" color="primary" onClick={() => setMostrarDialogo(true)}>+ Nuevo Tratamiento</Button>
          </Box>

          <Box display="flex" justifyContent="center" mt={4} gap={2}>
            <Button variant="outlined" onClick={() => navigate(`/consultorio/${usuario.subdominio}/pacientes`)}>Pacientes</Button>
            <Button variant="outlined" onClick={() => navigate(`/consultorio/${usuario.subdominio}/citas`)}>Citas</Button>
            <Button variant="outlined" onClick={() => navigate(`/consultorio/${usuario.subdominio}/presupuesto`)}>Presupuestos</Button>
          </Box>
        </Paper>
      </Container>

      {/* Diálogo para nuevo tratamiento */}
      <Dialog open={mostrarDialogo} onClose={() => setMostrarDialogo(false)}>
        <DialogTitle>Nuevo Tratamiento</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre del Tratamiento"
            fullWidth
            value={nuevoTratamiento}
            onChange={(e) => setNuevoTratamiento(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMostrarDialogo(false)}>Cancelar</Button>
          <Button onClick={crearNuevoTratamiento} variant="contained">Agregar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
