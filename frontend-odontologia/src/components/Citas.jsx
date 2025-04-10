import { useState, useEffect } from "react";
import { 
  Container, Typography, TextField, Button, MenuItem, Dialog, DialogTitle, 
  DialogContent, DialogActions, Card, CardContent, CardActions, Grid, Chip
} from "@mui/material";
import { Cancel, Event, AccessTime, Person, MedicalServices } from "@mui/icons-material";

export default function Citas({ pacientes, doctores }) {
  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [citas, setCitas] = useState(JSON.parse(sessionStorage.getItem("citas")) || []);

  // Estados para el diálogo de cancelación
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

    const updatedCitas = [...citas, nuevaCita];
    setCitas(updatedCitas);
    setOpen(false);
    // Limpiar campos
    setSelectedPatient("");
    setSelectedDoctor("");
    setFecha("");
    setHora("");
    setMotivo("");
  };

  // Función para determinar el estado de la cita
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

  // Función para enviar notificación de cancelación
  const enviarNotificacionCancel = (doctorId, pacienteNombre, reason) => {
    const doctor = doctores.find(d => d.id === doctorId);
    if (doctor) {
      const mensaje = `La cita ha sido cancelada. Motivo: ${reason}`;
      alert(`📲 WhatsApp enviado a ${doctor.telefono}: ${mensaje}`);
    }
    // Enviar notificación al paciente (simulada)
    alert(`📲 WhatsApp enviado a ${pacienteNombre}: La cita ha sido cancelada. Motivo: ${reason}`);
  };

  // Al hacer clic en cancelar, abrimos el diálogo
  const handleOpenCancel = (cita) => {
    // Solo se permite cancelar si la cita NO es el mismo día.
    const hoy = new Date().toISOString().split("T")[0]; // Obtener solo la fecha (YYYY-MM-DD)
    if (cita.fecha <= hoy) {
      alert("No es posible cancelar una cita el mismo día.");
      return;
    }
    setCitaToCancel(cita);
    setCancelReason("");
    setOpenCancel(true);
  };

  // Confirmar cancelación
  const handleConfirmCancel = () => {
    if (!cancelReason.trim()) return;

    // Buscar el doctor por nombre (porque en la cita guardamos el nombre, no el ID)
    const doctor = doctores.find(d => d.nombre === citaToCancel.doctor);

    // Enviar notificaciones de cancelación
    enviarNotificacionCancel(doctor?.id, citaToCancel.paciente, cancelReason);

    // Eliminar la cita
    const updatedCitas = citas.filter(cita => cita.id !== citaToCancel.id);
    setCitas(updatedCitas);
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

      {/* MODAL PARA NUEVA CITA */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Agendar Nueva Cita</DialogTitle>
        <DialogContent>
          <TextField 
            select fullWidth label="Paciente" value={selectedPatient} 
            onChange={(e) => setSelectedPatient(e.target.value)} margin="dense"
          >
            {pacientes.map((paciente) => (
              <MenuItem key={paciente.id} value={paciente.nombre}>
                {paciente.nombre}
              </MenuItem>
            ))}
          </TextField>

          <TextField 
            select fullWidth label="Doctor" value={selectedDoctor} 
            onChange={(e) => setSelectedDoctor(e.target.value)} margin="dense"
          >
            {doctores.map((doctor) => (
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

      {/* DIÁLOGO PARA CANCELAR CITA */}
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

      {/* TARJETAS DE CITAS */}
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
