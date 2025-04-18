import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import PanelAdministrador from "./components/PanelAdministrador";
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
import Odontograma3D from "./components/Odontograma3D";
import RegistrarDoctor from "./components/RegistrarDoctor";
import GestionarPrecios from "./components/GestionarPrecios";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas para roles 'admin' y 'msu' */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'msu']} />}>
        <Route path="/admin" element={<PanelAdministrador />} />
        <Route path="/admin/registrar-consultorio" element={<RegistrarConsultorio />} />
        <Route path="/admin/registrar-usuario" element={<RegistrarUsuario />} />
        <Route path="/registrar-doctor" element={<RegistrarDoctor />} />
        <Route path="/gestionar-precios" element={<GestionarPrecios />} />
      </Route>

      {/* Rutas accesibles para todos los usuarios autenticados */}
      <Route path="/home/:subdominio" element={<Home />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/configuracion" element={<Configuracion />} />
      <Route path="/seleccionar-consultorio" element={<SeleccionarConsultorio />} />

      {/* Rutas específicas del consultorio */}
      <Route path="/consultorio/:subdominio/pacientes" element={<Pacientes />} />
      <Route path="/consultorio/:subdominio/citas" element={<Citas />} />
      <Route path="/consultorio/:subdominio/doctores" element={<Doctores />} />
      <Route path="/consultorio/:subdominio/presupuesto" element={<Presupuesto />} />
      <Route path="/consultorio/:subdominio/historia-clinica" element={<HistoriaClinica />} />
      <Route path="/consultorio/:subdominio/odontograma3d/:id" element={<Odontograma3D />} />

      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
