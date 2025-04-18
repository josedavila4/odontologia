import React from "react";
import PrecioTratamiento from "../components/PrecioTratamiento";

export default function AdminPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Panel del Administrador</h1>
      {/* Aquí se muestra el formulario para registrar precios */}
      <PrecioTratamiento />
    </div>
  );
}
