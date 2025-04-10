import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, Paper, Box } from "@mui/material";

export default function SeleccionarConsultorio() {
  const [consultorios, setConsultorios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/consultorios")
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Consultorios recibidos:", data);
        setConsultorios(data);
      })
      .catch((error) => console.error("❌ Error obteniendo consultorios:", error));
  }, []);

  // ✅ Asegurar que `consultorio` se pasa correctamente
  const handleSeleccionar = (consultorio) => {
    console.log("🔹 Redirigiendo al consultorio:", consultorio.subdominio);
    navigate(`/home/${consultorio.subdominio}`);

  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold">
          Selecciona un Consultorio
        </Typography>
        {consultorios.length === 0 ? (
          <Typography color="error">No hay consultorios disponibles.</Typography>
        ) : (
          <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            {consultorios.map((consultorio) => (
              <Button
                key={consultorio.id}
                variant="contained"
                color="primary"
                onClick={() => handleSeleccionar(consultorio)} // ✅ PASA `consultorio`
              >
                {consultorio.nombre}
              </Button>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
}
