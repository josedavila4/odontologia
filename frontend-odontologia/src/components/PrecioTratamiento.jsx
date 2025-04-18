import { useState, useEffect } from "react";
import axios from "axios";

export default function PrecioTratamiento() {
  const [tratamientoId, setTratamientoId] = useState("");
  const [precio, setPrecio] = useState("");
  const [tratamientos, setTratamientos] = useState([]);
  const [precios, setPrecios] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("/api/tratamientos/todos")
      .then((res) => setTratamientos(res.data))
      .catch((err) => console.error("❌ Error cargando tratamientos:", err));

    axios.get("/api/precios/listar", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setPrecios(res.data))
      .catch((err) => console.error("❌ Error cargando precios:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "/api/precios/crear",
        {
          tratamiento_id: tratamientoId,
          precio: parseFloat(precio),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Precio guardado correctamente");
      setTratamientoId("");
      setPrecio("");

      // Recargar tabla de precios
      const res = await axios.get("/api/precios/listar", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrecios(res.data);

    } catch (error) {
      if (error.response?.status === 409) {
        alert("⚠️ Ya existe un precio registrado para ese tratamiento.");
      } else {
        alert("❌ Error al guardar precio");
        console.error(error);
      }
    }
  };

  return (
    <div className="p-4 rounded bg-white shadow-md max-w-xl mx-auto mt-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Registrar Precio de Tratamiento</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={tratamientoId}
          onChange={(e) => setTratamientoId(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Seleccione un tratamiento</option>
          {tratamientos.map((t) => (
            <option key={t.id} value={t.id}>{t.nombre}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Guardar Precio
        </button>
      </form>

      <div>
        <h3 className="font-bold mt-6 text-lg text-gray-700">Precios Registrados</h3>
        <table className="w-full border mt-2 text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border p-2 text-left">Tratamiento</th>
              <th className="border p-2 text-left">Precio</th>
            </tr>
          </thead>
          <tbody>
            {precios.map((p, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border p-2">{p.tratamiento}</td>
                <td className="border p-2">${p.precio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
