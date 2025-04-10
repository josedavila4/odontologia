import { useState } from "react";
import { 
  Container, Typography, TextField, Button, Paper, Grid, Avatar, 
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton 
} from "@mui/material";
import { Edit, PhotoCamera } from "@mui/icons-material";

export default function Doctores({ doctores, updateDoctores }) {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [foto, setFoto] = useState(null);

  // Manejar la carga de imágenes
  const handleFotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result); // Guardamos la imagen en base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddOrEditDoctor = () => {
    if (!nombre.trim() || !correo.trim() || !telefono.trim()) return;

    const newDoctor = {
      id: editIndex !== null ? doctores[editIndex].id : Date.now(),
      nombre,
      correo,
      telefono,
      foto, // Guardamos la imagen en base64
    };

    const updatedDoctores = editIndex !== null ? [...doctores] : [...doctores, newDoctor];
    if (editIndex !== null) updatedDoctores[editIndex] = newDoctor;

    updateDoctores(updatedDoctores);
    sessionStorage.setItem("doctores", JSON.stringify(updatedDoctores));

    setOpen(false);
    setEditIndex(null);
  };

  const handleEditDoctor = (index) => {
    const doctor = doctores[index];
    setNombre(doctor.nombre);
    setCorreo(doctor.correo);
    setTelefono(doctor.telefono);
    setFoto(doctor.foto);
    setEditIndex(index);
    setOpen(true);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>Gestión de Doctores</Typography>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => { 
          setOpen(true);
          setEditIndex(null);
          setNombre("");
          setCorreo("");
          setTelefono("");
          setFoto(null);
        }}>
        Agregar Doctor
      </Button>

      <Typography variant="h6" sx={{ mt: 3 }}>Lista de Doctores</Typography>
      {doctores.length === 0 ? <Typography>No hay doctores registrados.</Typography> : (
        doctores.map((doctor, index) => (
          <Paper key={doctor.id} sx={{ padding: 2, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar src={doctor.foto} sx={{ width: 56, height: 56 }} />
              </Grid>
              <Grid item xs>
                <Typography variant="body1"><strong>{doctor.nombre}</strong></Typography>
                <Typography variant="body2">{doctor.telefono} | {doctor.correo}</Typography>
              </Grid>
              <Grid item>
                <IconButton color="primary" onClick={() => handleEditDoctor(index)}>
                  <Edit />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        ))
      )}

      {/* MODAL PARA AGREGAR O EDITAR DOCTOR */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editIndex !== null ? "Editar Doctor" : "Agregar Doctor"}</DialogTitle>
        <DialogContent>
          {/* PREVISUALIZACIÓN DE FOTO */}
          <Grid container justifyContent="center" sx={{ mb: 2 }}>
            <Avatar src={foto} sx={{ width: 80, height: 80 }} />
          </Grid>
          <Button 
            variant="contained" 
            component="label"
            fullWidth
            startIcon={<PhotoCamera />}
            sx={{ mb: 2 }}
          >
            Subir Foto
            <input type="file" hidden accept="image/*" onChange={handleFotoChange} />
          </Button>

          <TextField fullWidth label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required margin="dense" />
          <TextField fullWidth label="Correo Electrónico" value={correo} onChange={(e) => setCorreo(e.target.value)} required margin="dense" />
          <TextField fullWidth label="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required margin="dense" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">Cancelar</Button>
          <Button onClick={handleAddOrEditDoctor} color="primary" variant="contained">
            {editIndex !== null ? "Guardar Cambios" : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
