import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PanelConsultorio({ subdominio }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4">Bienvenido a {subdominio}</Typography>
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate("/pacientes")}>
        Ver Pacientes
      </Button>
      <Button variant="contained" color="secondary" sx={{ mt: 2, ml: 2 }} onClick={() => navigate("/citas")}>
        Ver Citas
      </Button>
    </Box>
  );
}
