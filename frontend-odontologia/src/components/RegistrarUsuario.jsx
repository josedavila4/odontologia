import { useState, useEffect } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, MenuItem } from "@mui/material";

export default function RegistrarUsuario() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [rol, setRol] = useState("usuario");
  const [consultorios, setConsultorios] = useState([]);
  const [consultorioSeleccionado, setConsultorioSeleccionado] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/consultorios")
      .then(response => setConsultorios(response.data))
      .catch(() => setMensaje("Error al cargar los consultorios"));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensaje("");

    axios.post("http://localhost:5000/api/usuarios", {
      nombre,
      correo,
      contraseña,
      rol,
      consultorio_id: consultorioSeleccionado
    })
      .then(() => setMensaje("Usuario registrado correctamente"))
      .catch(() => setMensaje("Error al registrar usuario"));
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>Registrar Usuario</Typography>
      {mensaje && <Typography color="error">{mensaje}</Typography>}

      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required margin="dense" />
        <TextField fullWidth label="Correo Electrónico" value={correo} onChange={(e) => setCorreo(e.target.value)} required margin="dense" />
        <TextField fullWidth label="Contraseña" type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required margin="dense" />
        
        <TextField
          fullWidth
          select
          label="Rol"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          margin="dense"
        >
          <MenuItem value="usuario">Usuario</MenuItem>
          <MenuItem value="admin">Administrador</MenuItem>
        </TextField>

        <TextField
          fullWidth
          select
          label="Consultorio"
          value={consultorioSeleccionado}
          onChange={(e) => setConsultorioSeleccionado(e.target.value)}
          margin="dense"
          required
        >
          {consultorios.map((consultorio) => (
            <MenuItem key={consultorio.id} value={consultorio.id}>{consultorio.nombre}</MenuItem>
          ))}
        </TextField>

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Registrar Usuario
        </Button>
      </form>
    </Container>
  );
}
