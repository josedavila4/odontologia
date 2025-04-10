import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PanelAdministrador() {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4">Panel de Administración</Typography>
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate("/registrar-consultorio")}>
        Registrar Consultorio
      </Button>
    </Box>
  );
}
