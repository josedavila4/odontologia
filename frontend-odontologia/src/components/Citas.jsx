import { useState, useEffect } from "react";
import { 
  Container, Typography, TextField, Button, MenuItem, Dialog, DialogTitle, 
  DialogContent, DialogActions, Card, CardContent, CardActions, Grid
} from "@mui/material";
import { Cancel, Event, AccessTime, Person, MedicalServices } from "@mui/icons-material";

export default function Citas({ pacientes = [], doctores = [] }) {
  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [citas, setCitas] = useState(JSON.parse(sessionStorage.getItem("citas")) || []);

  const [openCancel, setOpenCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [citaToCancel, setCitaToCancel] = useState(null);

  useEffect(() => {
    sessionStorage.setItem("citas", JSON.stringify(citas));
  }, [citas]);

  const handleSaveCita = () => {
    if (!selectedPatient || !selectedDoctor || !fecha || !hora || !motivo) return;

    const nuevaCita = { 
      id: Date.now(), 
      paciente: selectedPatient, 
      doctor: selectedDoctor, 
      fecha, 
      hora, 
      motivo 
    };

    setCitas([...citas, nuevaCita]);
    setOpen(false);
    setSelectedPatient("");
    setSelectedDoctor("");
    setFecha("");
    setHora("");
    setMotivo("");
  };

  const clasificarCitas = () => {
    const ahora = new Date();
    return citas.map((cita) => {
      const citaFecha = new Date(`${cita.fecha}T${cita.hora}`);
      return {
        ...cita,
        estado: citaFecha >= ahora ? "Pendiente" : "Vencida",
        citaFecha
      };
    });
  };

  const enviarNotificacionCancel = (doctorId, pacienteNombre, reason) => {
    const doctor = doctores.find(d => d.id === doctorId);
    if (doctor) {
      const mensaje = `La cita ha sido cancelada. Motivo: ${reason}`;
      alert(`📲 WhatsApp enviado a ${doctor.telefono}: ${mensaje}`);
    }
    alert(`📲 WhatsApp enviado a ${pacienteNombre}: La cita ha sido cancelada. Motivo: ${reason}`);
  };

  const handleOpenCancel = (cita) => {
    const hoy = new Date().toISOString().split("T")[0];
    if (cita.fecha <= hoy) {
      alert("No es posible cancelar una cita el mismo día.");
      return;
    }
    setCitaToCancel(cita);
    setCancelReason("");
    setOpenCancel(true);
  };

  const handleConfirmCancel = () => {
    if (!cancelReason.trim()) return;

    const doctor = doctores.find(d => d.nombre === citaToCancel.doctor);
    enviarNotificacionCancel(doctor?.id, citaToCancel.paciente, cancelReason);
    setCitas(citas.filter(cita => cita.id !== citaToCancel.id));
    setOpenCancel(false);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Agendamiento de Citas
      </Typography>

      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Nueva Cita
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Agendar Nueva Cita</DialogTitle>
        <DialogContent>
          <TextField 
            select fullWidth label="Paciente" value={selectedPatient} 
            onChange={(e) => setSelectedPatient(e.target.value)} margin="dense"
          >
            {Array.isArray(pacientes) && pacientes.map((paciente) => (
              <MenuItem key={paciente.id} value={paciente.nombre}>
                {paciente.nombre}
              </MenuItem>
            ))}
          </TextField>

          <TextField 
            select fullWidth label="Doctor" value={selectedDoctor} 
            onChange={(e) => setSelectedDoctor(e.target.value)} margin="dense"
          >
            {Array.isArray(doctores) && doctores.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.nombre}>
                {doctor.nombre}
              </MenuItem>
            ))}
          </TextField>

          <TextField fullWidth label="Fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} margin="dense" />
          <TextField fullWidth label="Hora" type="time" value={hora} onChange={(e) => setHora(e.target.value)} margin="dense" />
          <TextField fullWidth label="Motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} margin="dense" />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSaveCita} color="primary" variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCancel} onClose={() => setOpenCancel(false)}>
        <DialogTitle>Cancelar Cita</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Motivo de Cancelación"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancel(false)} color="secondary">
            Volver
          </Button>
          <Button onClick={handleConfirmCancel} color="primary" variant="contained">
            Confirmar Cancelación
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {clasificarCitas().map((cita) => (
          <Grid item xs={12} sm={6} md={4} key={cita.id}>
            <Card sx={{ padding: 2, borderLeft: `6px solid ${cita.estado === "Pendiente" ? "green" : "red"}` }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Person /> {cita.paciente}
                </Typography>
                <Typography variant="body1">
                  <MedicalServices /> {cita.doctor}
                </Typography>
                <Typography variant="body2">
                  <Event /> {cita.fecha}
                </Typography>
                <Typography variant="body2">
                  <AccessTime /> {cita.hora}
                </Typography>
              </CardContent>
              <CardActions>
                {cita.fecha > new Date().toISOString().split("T")[0] && (
                  <Button startIcon={<Cancel />} onClick={() => handleOpenCancel(cita)} color="warning" variant="contained">
                    Cancelar
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
