import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Paper,
  Grid,
  Avatar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Search, Edit, Delete, AccountBox, MonetizationOn, AddCircle } from "@mui/icons-material";

export default function Pacientes() {
  const { subdominio } = useParams();
  const [pacientes, setPacientes] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`📱 Cargando pacientes del consultorio: ${subdominio}`);
    const token = localStorage.getItem("token");

    axios
      .get(`/api/pacientes/${subdominio}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("✅ Pacientes recibidos:", response.data);
        setPacientes(response.data);
      })
      .catch((error) => {
        console.error("❌ Error cargando pacientes:", error);
        setMensaje("Error al cargar los pacientes. Verifique su conexión.");
      });
  }, [subdominio]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleDeletePatient = (paciente) => {
    setSelectedPatient(paciente);
    setOpenDeleteDialog(true);
  };

  const confirmDeletePatient = () => {
    axios
      .delete(`/api/pacientes/${subdominio}/${selectedPatient.cedula}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        setPacientes(pacientes.filter((p) => p.cedula !== selectedPatient.cedula));
        setOpenDeleteDialog(false);
      })
      .catch((error) => console.error("❌ Error eliminando paciente:", error));
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Gestión de Pacientes
      </Typography>

      <Grid container spacing={2} justifyContent="space-between">
        <Grid item xs={8}>
          <TextField
            fullWidth
            label="Buscar Paciente"
            variant="outlined"
            margin="dense"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{ startAdornment: <Search sx={{ mr: 1 }} /> }}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircle />}
            onClick={() => navigate(`/consultorio/${subdominio}/nuevo-paciente`)}
          >
            Nuevo Paciente
          </Button>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Lista de Pacientes
      </Typography>

      {mensaje ? (
        <Typography color="error" sx={{ mt: 2 }}>
          {mensaje}
        </Typography>
      ) : pacientes.length === 0 ? (
        <Typography align="center" sx={{ mt: 2 }}>
          No se encontraron pacientes.
        </Typography>
      ) : (
        pacientes.map((paciente) => (
          <Paper
            key={paciente.id}
            sx={{
              padding: 2,
              marginTop: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  {paciente.nombre.charAt(0)}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="body1">
                  <strong>{paciente.nombre}</strong>
                </Typography>
                <Typography variant="body2">
                  {paciente.telefono} | {paciente.correo}
                </Typography>
              </Grid>
              <Grid item>
                <IconButton
                  color="info"
                  onClick={() =>
                    navigate(
                      `/consultorio/${subdominio}/odontograma3d/${paciente.cedula}`,
                      { state: { selectedPatient: paciente } }
                    )
                  }
                >
                  <AccountBox />
                </IconButton>
                <IconButton
                  color="success"
                  onClick={() =>
                    navigate(
                      `/consultorio/${subdominio}/presupuesto/${paciente.cedula}`,
                      { state: { selectedPatient: paciente } }
                    )
                  }
                >
                  <MonetizationOn />
                </IconButton>
                <IconButton color="primary">
                  <Edit />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDeletePatient(paciente)}
                >
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        ))
      )}

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>¿Eliminar paciente?</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar a {selectedPatient?.nombre}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={confirmDeletePatient}
            color="error"
            variant="contained"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
