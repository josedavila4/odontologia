import { useState } from "react";
import axios from "axios";
import {
  Container, Typography, TextField, Button, Paper, Grid
} from "@mui/material";

export default function RegistrarDoctor() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const consultorio_id = decoded.consultorio_id;

      await axios.post("/api/doctores/crear", {
        nombre,
        telefono,
        correo,
        fecha_nacimiento: fechaNacimiento,
        consultorio_id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ Doctor registrado con éxito");
      setNombre(""); setTelefono(""); setCorreo(""); setFechaNacimiento("");
    } catch (error) {
      console.error("❌ Error registrando doctor:", error);
      alert("❌ Error al registrar el doctor");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>Registrar Nuevo Doctor</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField label="Nombre" fullWidth required value={nombre} onChange={e => setNombre(e.target.value)} /></Grid>
            <Grid item xs={12}><TextField label="Teléfono" fullWidth required value={telefono} onChange={e => setTelefono(e.target.value)} /></Grid>
            <Grid item xs={12}><TextField label="Correo" type="email" fullWidth required value={correo} onChange={e => setCorreo(e.target.value)} /></Grid>
            <Grid item xs={12}><TextField label="Fecha de nacimiento" type="date" fullWidth required InputLabelProps={{ shrink: true }} value={fechaNacimiento} onChange={e => setFechaNacimiento(e.target.value)} /></Grid>
            <Grid item xs={12}><Button type="submit" variant="contained" fullWidth>Registrar Doctor</Button></Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
