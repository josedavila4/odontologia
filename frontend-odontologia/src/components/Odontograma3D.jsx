import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState, Suspense, useRef } from "react";
import axios from "axios";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, FormControlLabel, Checkbox, FormGroup, Box
} from "@mui/material";

export default function Odontograma3D({ setTabIndex }) {
  const location = useLocation();
  const { subdominio, cedula } = useParams();
  const selectedPatient = location.state?.selectedPatient || null;

  const { scene } = useGLTF("/dientes.glb");
  const allMeshes = useRef({});
  const [paciente, setPaciente] = useState(selectedPatient || null);
  const [historiaClinica, setHistoriaClinica] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [presente, setPresente] = useState(true);
  const [endodoncia, setEndodoncia] = useState(false);
  const [calza, setCalza] = useState(false);

  useEffect(() => {
    const meshes = {};
    scene.traverse((child) => {
      if (child.isMesh) {
        meshes[child.name] = child;
        child.visible = false; // Ocultar todo desde el inicio
      }
    });
    allMeshes.current = meshes;
  }, [scene]);

  useEffect(() => {
    if (!subdominio || !cedula) return;

    axios.get(`http://localhost:5000/api/pacientes/${subdominio}/${cedula}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => {
        setPaciente(res.data);
        return axios.get(`http://localhost:5000/api/historia-clinica/${subdominio}/${cedula}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      })
      .then(res => setHistoriaClinica(res.data))
      .catch(console.error);
  }, [subdominio, cedula]);

  useEffect(() => {
    // 🔄 Resetear visibilidad
    Object.keys(allMeshes.current).forEach(nombre => {
      allMeshes.current[nombre].visible = false;
    });

    historiaClinica.forEach(({ diente, tratamiento, diagnostico }) => {
      const visible = diagnostico !== "Ausente";
      if (!visible) return;

      if (tratamiento === "Endodoncia") {
        [`${diente}_endo`, `${diente}_r_caries`].forEach(layer => {
          if (allMeshes.current[layer]) allMeshes.current[layer].visible = true;
        });
      } else if (tratamiento === "Calza (Caries)") {
        const caries = `${diente}_caries`;
        if (allMeshes.current[caries]) allMeshes.current[caries].visible = true;
      } else {
        if (allMeshes.current[diente]) allMeshes.current[diente].visible = true;
      }
    });
  }, [historiaClinica]);

  const handleToothClick = (e) => {
    e.stopPropagation();
    if (!e.object.isMesh) return;

    const baseName = e.object.name.replace(/(_caries|_endo|_r)/g, "");
    setSelectedTooth(baseName);

    const toothData = historiaClinica.find(item => item.diente === baseName) || {};
    const dientePresente = toothData.diagnostico !== "Ausente";

    setPresente(dientePresente);
    setEndodoncia(toothData.tratamiento === "Endodoncia");
    setCalza(toothData.tratamiento === "Calza (Caries)");

    Object.keys(allMeshes.current).forEach(nombre => {
      if (nombre.startsWith(baseName)) {
        allMeshes.current[nombre].visible = false;
      }
    });

    if (dientePresente) {
      if (toothData.tratamiento === "Endodoncia") {
        [`${baseName}_endo`, `${baseName}_r_caries`].forEach(layer => {
          if (allMeshes.current[layer]) allMeshes.current[layer].visible = true;
        });
      } else if (toothData.tratamiento === "Calza (Caries)") {
        const caries = `${baseName}_caries`;
        if (allMeshes.current[caries]) allMeshes.current[caries].visible = true;
      } else {
        if (allMeshes.current[baseName]) {
          allMeshes.current[baseName].visible = true;
        }
      }
    }

    setOpen(true);
  };

  const handleSave = async () => {
    if (!selectedTooth || !paciente) return;

    let tratamiento = "";
    if (presente) {
      if (endodoncia) tratamiento = "Endodoncia";
      else if (calza) tratamiento = "Calza (Caries)";
    }

    const updated = historiaClinica.filter(item => item.diente !== selectedTooth);
    updated.push({
      diente: selectedTooth,
      tratamiento,
      presente
    });

    setHistoriaClinica(updated);

    try {
      await axios.post(`http://localhost:5000/api/historia-clinica/${subdominio}/${paciente.cedula}`, {
        historiaClinica: updated
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("✅ Historia clínica guardada");
    } catch (error) {
      console.error("❌ Error al guardar historia clínica:", error);
    }

    setOpen(false);
  };

  return (
    <>
      <h1>Odontograma 3D</h1>
      <h2>Paciente: {paciente?.nombre}</h2>

      <Canvas style={{ width: "100%", height: "500px" }} camera={{ position: [0, 0, 5], zoom: 1 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <Suspense fallback={null}>
          <primitive object={scene} position={[0, -1, 0]} onPointerDown={handleToothClick} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          target={[0, 0, 0]}
        />
      </Canvas>

      <Box display="flex" justifyContent="center" gap={2} mt={2}>
        <Button variant="contained" color="primary" onClick={() => setTabIndex(2)}>Ir a Presupuesto</Button>
        <Button variant="contained" color="secondary" onClick={() => setTabIndex(3)}>Ir a Citas</Button>
        <Button variant="contained" onClick={() => setTabIndex(0)}>Regresar</Button>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Registro para Diente {selectedTooth}</DialogTitle>
        <DialogContent>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={presente} onChange={() => setPresente(!presente)} />}
              label="El diente está presente"
            />
            <FormControlLabel
              control={<Checkbox checked={endodoncia} disabled={!presente || calza} onChange={() => setEndodoncia(!endodoncia)} />}
              label="Endodoncia"
            />
            <FormControlLabel
              control={<Checkbox checked={calza} disabled={!presente || endodoncia} onChange={() => setCalza(!calza)} />}
              label="Calza (Caries)"
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">Cancelar</Button>
          <Button onClick={handleSave} color="primary" variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
