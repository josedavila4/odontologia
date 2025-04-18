import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container, Typography, TextField, Paper, MenuItem, Button, Table, TableHead,
  TableRow, TableCell, TableBody, TableContainer, Box
} from "@mui/material";

export default function GestionarPrecios() {
  const [tratamientos, setTratamientos] = useState([]);
  const [precios, setPrecios] = useState([]);
  const [tratamientoId, setTratamientoId] = useState("");
  const [precio, setPrecio] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("/api/tratamientos/todos")
      .then(res => setTratamientos(res.data));

    axios.get("/api/precios/listar", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setPrecios(res.data));
  }, []);

  const guardarPrecio = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/precios/crear", {
        tratamiento_id: tratamientoId,
        precio: parseFloat(precio)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const res = await axios.get("/api/precios/listar", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrecios(res.data);
      setPrecio("");
      setTratamientoId("");
    } catch (err) {
      alert("❌ No se pudo guardar el precio");
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ mt: 4, p: 4 }}>
        <Typography variant="h5" gutterBottom>Gestión de Precios</Typography>
        <form onSubmit={guardarPrecio}>
          <Box display="flex" gap={2} mb={3}>
            <TextField
              select fullWidth required
              label="Tratamiento"
              value={tratamientoId}
              onChange={(e) => setTratamientoId(e.target.value)}
            >
              {tratamientos.map((t) => (
                <MenuItem key={t.id} value={t.id}>{t.nombre}</MenuItem>
              ))}
            </TextField>

            <TextField
              label="Precio"
              type="number"
              fullWidth required
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />

            <Button type="submit" variant="contained" color="primary">
              Guardar
            </Button>
          </Box>
        </form>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Tratamiento</TableCell>
                <TableCell>Precio</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {precios.map((p, i) => (
                <TableRow key={i}>
                  <TableCell>{p.tratamiento}</TableCell>
                  <TableCell>${p.precio}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}
