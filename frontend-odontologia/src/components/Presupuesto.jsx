import { useState, useEffect } from "react";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  TextField, Typography, Button, MenuItem, Select, IconButton, FormControlLabel, Checkbox 
} from "@mui/material";
import { Add } from "@mui/icons-material";

export default function Presupuesto({ selectedPatient, updatePatient }) {
  const [presupuestos, setPresupuestos] = useState(selectedPatient?.presupuestos || []);
  const [selectedPresupuestoIndex, setSelectedPresupuestoIndex] = useState(null);
  const [presupuestoNombre, setPresupuestoNombre] = useState("");
  const [currentPresupuesto, setCurrentPresupuesto] = useState([]);

  // 🔥 Sincronizar el presupuesto con la Historia Clínica (Odontograma)
  useEffect(() => {
    if (selectedPatient?.historiaClinica && selectedPresupuestoIndex === null) {
      const updatedHistoriaPresupuesto = selectedPatient.historiaClinica.map(diente => ({
        diente: diente.diente,
        diagnostico: diente.diagnostico || "",
        tratamiento: diente.tratamiento || "",
        costo: diente.costo || "",
        presente: diente.presente ?? true
      }));

      setCurrentPresupuesto(updatedHistoriaPresupuesto);
    }
  }, [selectedPatient?.historiaClinica, selectedPresupuestoIndex]);

  // 🔥 Sincronizar cuando se selecciona un presupuesto
  useEffect(() => {
    if (selectedPresupuestoIndex !== null && presupuestos[selectedPresupuestoIndex]) {
      setCurrentPresupuesto(presupuestos[selectedPresupuestoIndex].detalles);
      setPresupuestoNombre(presupuestos[selectedPresupuestoIndex].nombre);
    } else {
      setCurrentPresupuesto([]);
      setPresupuestoNombre("");
    }
  }, [selectedPresupuestoIndex]);

  // Manejar cambios en los tratamientos del presupuesto
  const handleChange = (index, field, value) => {
    const updatedPresupuesto = [...currentPresupuesto];
    updatedPresupuesto[index][field] = value;
    setCurrentPresupuesto(updatedPresupuesto);
  };

  // Agregar una nueva fila sin diente específico (Ejemplo: Profilaxis, Blanqueamiento)
  const handleAddNewRow = () => {
    setCurrentPresupuesto([...currentPresupuesto, { diente: "", diagnostico: "", tratamiento: "", costo: "", presente: true }]);
  };

  // Guardar un nuevo presupuesto o actualizar uno existente
  const handleSavePresupuesto = () => {
    if (!presupuestoNombre.trim()) {
      alert("El presupuesto debe tener un nombre.");
      return;
    }

    const newPresupuesto = {
      fecha: new Date().toLocaleDateString(),
      nombre: presupuestoNombre,
      detalles: currentPresupuesto
    };

    let updatedPresupuestos;

    if (selectedPresupuestoIndex !== null) {
      // Actualizar un presupuesto existente
      updatedPresupuestos = presupuestos.map((p, index) => 
        index === selectedPresupuestoIndex ? newPresupuesto : p
      );
    } else {
      // Agregar un nuevo presupuesto
      updatedPresupuestos = [...presupuestos, newPresupuesto];
      setSelectedPresupuestoIndex(updatedPresupuestos.length - 1);
    }

    setPresupuestos(updatedPresupuestos);

    if (typeof updatePatient === "function") {
      updatePatient({ ...selectedPatient, presupuestos: updatedPresupuestos });
    } else {
      console.error("updatePatient no está definido en Presupuesto.jsx");
    }
  };

  // Seleccionar un presupuesto de la lista
  const handleSelectPresupuesto = (index) => {
    setSelectedPresupuestoIndex(index);
  };

  // Calcular el total del presupuesto
  const calcularTotal = () => {
    return currentPresupuesto.reduce((total, diente) => total + (parseFloat(diente.costo) || 0), 0).toFixed(2);
  };

  return (
    <>
      <Typography variant="h5" align="center" gutterBottom>
        Presupuesto para {selectedPatient?.nombre || "Paciente"}
      </Typography>

      {/* Selección de Presupuesto */}
      <Select
        fullWidth
        value={selectedPresupuestoIndex !== null ? selectedPresupuestoIndex : ""}
        onChange={(e) => handleSelectPresupuesto(e.target.value)}
        displayEmpty
        sx={{ mb: 2 }}
      >
        <MenuItem value="" disabled>Selecciona un presupuesto</MenuItem>
        {presupuestos.map((presupuesto, index) => (
          <MenuItem key={index} value={index}>{presupuesto.nombre} - {presupuesto.fecha}</MenuItem>
        ))}
        <MenuItem value={null}>Nuevo Presupuesto</MenuItem>
      </Select>

      {/* Nombre del presupuesto */}
      <TextField
        fullWidth
        label="Nombre del Presupuesto"
        value={presupuestoNombre}
        onChange={(e) => setPresupuestoNombre(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* Tabla de Tratamientos */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Diente</strong></TableCell>
              <TableCell><strong>Diagnóstico</strong></TableCell>
              <TableCell><strong>Tratamiento</strong></TableCell>
              <TableCell><strong>Costo ($)</strong></TableCell>
              <TableCell><strong>Presente</strong></TableCell>
              <TableCell>
                <IconButton onClick={handleAddNewRow} color="primary">
                  <Add />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPresupuesto.map((diente, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField fullWidth value={diente.diente || ""} onChange={(e) => handleChange(index, "diente", e.target.value)} />
                </TableCell>
                <TableCell>
                  <TextField fullWidth value={diente.diagnostico || ""} onChange={(e) => handleChange(index, "diagnostico", e.target.value)} />
                </TableCell>
                <TableCell>
                  <TextField fullWidth value={diente.tratamiento || ""} onChange={(e) => handleChange(index, "tratamiento", e.target.value)} />
                </TableCell>
                <TableCell>
                  <TextField fullWidth type="number" value={diente.costo || ""} onChange={(e) => handleChange(index, "costo", e.target.value)} />
                </TableCell>
                <TableCell>
                  <FormControlLabel
                    control={<Checkbox checked={diente.presente} />}
                    label={diente.presente ? "Sí" : "No"}
                    disabled
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Total del presupuesto */}
      <Typography variant="h6" align="right" sx={{ mt: 2 }}>
        Total: ${calcularTotal()}
      </Typography>

      {/* Botón para Guardar Presupuesto */}
      <Button variant="contained" color="primary" sx={{ mt: 2 }} fullWidth onClick={handleSavePresupuesto}>
        Guardar Presupuesto
      </Button>
    </>
  );
}
