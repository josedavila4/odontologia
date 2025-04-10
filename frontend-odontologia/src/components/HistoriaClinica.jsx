import Odontograma3D from "./Odontograma3D";
import { Typography, Box } from "@mui/material";
import { useState } from "react";

export default function HistoriaClinica({ selectedPatient, updatePatient }) {
  const [patientData, setPatientData] = useState(selectedPatient || { historiaClinica: [] });

  if (!selectedPatient) return <p>Selecciona un paciente.</p>;

  const handleUpdatePatient = (updatedPatient) => {
    setPatientData(updatedPatient);
    updatePatient(updatedPatient); // Llamamos la función para actualizar el paciente en App.jsx
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Historia Clínica de {selectedPatient.nombre}
      </Typography>
      <Odontograma3D selectedPatient={patientData} updatePatient={handleUpdatePatient} />
    </Box>
  );
}
