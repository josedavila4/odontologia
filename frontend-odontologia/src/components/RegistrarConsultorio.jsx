import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";

export default function RegistrarConsultorio({ setTabIndex }) {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const response = await axios.post("http://localhost:5000/api/consultorios", {
        nombre,
        direccion,
        telefono,
      });

      setMensaje("Consultorio registrado con éxito");
      setNombre("");
      setDireccion("");
      setTelefono("");

      setTimeout(() => setTabIndex(0), 2000); // Volver a la pantalla principal
    } catch (error) {
      setMensaje("Error al registrar el consultorio");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
      <Typography variant="h5">Registrar Consultorio</Typography>
      {mensaje && <Typography color="primary">{mensaje}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nombre"
          margin="normal"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <TextField
          fullWidth
          label="Dirección"
          margin="normal"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
        <TextField
          fullWidth
          label="Teléfono"
          margin="normal"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Registrar
        </Button>
      </form>
    </Box>
  );
}
