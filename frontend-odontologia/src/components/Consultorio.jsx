import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Paper, Box } from "@mui/material";

export default function Consultorio() {
  const { subdominio } = useParams();
  const navigate = useNavigate();
  const [consultorio, setConsultorio] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("📌 Subdominio recibido en URL:", subdominio); // 🔍 DEPURACIÓN
  
    fetch(`http://localhost:5000/api/consultorios/${subdominio}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Datos del consultorio recibidos:", data);
        if (data && data.nombre) {
          setConsultorio(data);
        } else {
          setError("El consultorio no tiene un nombre válido.");
        }
      })
      .catch((error) => {
        console.error("❌ Error obteniendo el consultorio:", error);
        setError("Error al cargar los datos.");
      });
  }, [subdominio]);
  

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: "center" }}>
      <Typography variant="h4" fontWeight="bold">
  Bienvenido a {consultorio?.nombre || "Consultorio Desconocido"}
</Typography>


        {error && <Typography color="error">{error}</Typography>}
        <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "center" }}>
          <Button variant="contained" color="primary" onClick={() => navigate(`/pacientes/${subdominio}`)}>
            VER PACIENTES
          </Button>
          <Button variant="contained" color="secondary" onClick={() => navigate(`/citas/${subdominio}`)}>
            VER CITAS
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
