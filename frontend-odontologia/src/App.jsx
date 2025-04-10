import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import PanelAdministrador from "./components/PanelAdministrador";
import PanelConsultorio from "./components/PanelConsultorio";
import RegistrarConsultorio from "./components/RegistrarConsultorio";
import RegistrarUsuario from "./components/RegistrarUsuario";
import Pacientes from "./components/Pacientes";
import Citas from "./components/Citas";
import Doctores from "./components/Doctores";
import Presupuesto from "./components/Presupuesto";
import HistoriaClinica from "./components/HistoriaClinica";
import Perfil from "./components/Perfil";
import Configuracion from "./components/Configuracion";
import SeleccionarConsultorio from "./components/SeleccionarConsultorio";
import Consultorio from "./components/Consultorio";
import Odontograma3D from "./components/Odontograma3D"; // Ajusta la ruta si es necesario


export default function App() {
  return (
    <Routes>
      {/* ✅ Rutas generales */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<PanelAdministrador />} />
      <Route path="/admin/registrar-consultorio" element={<RegistrarConsultorio />} />
      <Route path="/admin/registrar-usuario" element={<RegistrarUsuario />} />

      {/* ✅ Rutas antiguas que usaban :id (opcional). 
          Borra estas si ya no las usas. */}
      <Route path="/consultorio/:subdominio/pacientes" element={<Pacientes />} />
      <Route path="/consultorio/:subdominio/citas" element={<Citas />} />
      <Route path="/consultorio/:subdominio/doctores" element={<Doctores />} />
      <Route path="/consultorio/:subdominio/presupuesto" element={<Presupuesto />} />
      <Route path="/consultorio/:subdominio/historia-clinica" element={<HistoriaClinica />} />

      {/* ✅ Rutas de perfil y configuración */}
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/configuracion" element={<Configuracion />} />

      {/* ✅ Pantalla para MSU: selección de consultorio */}
      <Route path="/seleccionar-consultorio" element={<SeleccionarConsultorio />} />

      {/* 
        ✅ Ruta principal UNIFICADA para "Home" con subdominio.
        Aquí puedes usar "Home" o "Consultorio" — el que tengas.
        Lo ideal: 
          <Route path="/home/:subdominio" element={<Home />} />
        O lo que prefieras. 
      */}
      <Route path="/home/:subdominio" element={<Home />} />

      {/* 
        OJO: Si quieres usar Consultorio en lugar de Home, 
        cambia a: 
          <Route path="/home/:subdominio" element={<Consultorio />} />
        y borra la de "/consultorio/home/:subdominio"
      */}
      <Route path="/consultorio/home/:subdominio" element={<Consultorio />} />

      {/* 
        ❌ Quita esta si ya no quieres "/home" sin subdominio.
        <Route path="/home" element={<Home />} /> 
      */}

      {/* ✅ Ruta por defecto */}
      <Route path="*" element={<Navigate to="/login" />} />
      <Route path="/consultorio/:subdominio/pacientes" element={<Pacientes />} />
      <Route path="/consultorio/:subdominio/odontograma3d/:id" element={<Odontograma3D />} />


    </Routes>
  );
}
