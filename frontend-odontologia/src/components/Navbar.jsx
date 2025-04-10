import { AppBar, Tabs, Tab, Box } from "@mui/material";
import { Person, MedicalServices, MonetizationOn, Event, LocalHospital, Business } from "@mui/icons-material"; // Importamos el icono de Consultorios

export default function Navbar({ tabIndex, setTabIndex, selectedPatient }) {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976D2", borderRadius: 2 }}>
      <Tabs
        value={tabIndex}
        onChange={(e, newValue) => {
          if (newValue === 0 || (newValue > 0 && selectedPatient) || newValue === 3 || newValue === 4 || newValue === 5) {
            setTabIndex(newValue);
          }
        }}
        centered
        textColor="inherit"
        indicatorColor="secondary"
      >
        <Tab icon={<Person fontSize="large" />} label="PACIENTES" value={0} />
        <Tab icon={<MedicalServices fontSize="large" />} label="HISTORIA CLÍNICA" value={1} disabled={!selectedPatient} />
        <Tab icon={<MonetizationOn fontSize="large" />} label="PRESUPUESTO" value={2} disabled={!selectedPatient} />
        <Tab icon={<Event fontSize="large" />} label="CITAS" value={3} />
        <Tab icon={<LocalHospital fontSize="large" />} label="DOCTORES" value={4} />
        <Tab icon={<Business fontSize="large" />} label="CONSULTORIOS" value={5} /> {/* Nueva pestaña */}
      </Tabs>
    </AppBar>
  );
}
