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
  const params = useParams();
  const selectedPatient = location.state?.selectedPatient || null;

  const subdominio = params.subdominio;
  const cedula = params.cedula || selectedPatient?.cedula;

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
        child.visible = false;
      }
    });
    allMeshes.current = meshes;
    console.log("🎨 Mallas cargadas en el modelo:", Object.keys(meshes));
  }, [scene]);

  useEffect(() => {
    if (!subdominio || !cedula) {
      console.warn("🚨 Falta subdominio o cédula:", subdominio, cedula);
      return;
    }

    console.log("🔍 Iniciando carga para:", subdominio, cedula);

    axios.get(`http://localhost:5000/api/pacientes/${subdominio}/${cedula}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(res => {
      console.log("🧍 Paciente recibido:", res.data);
    
      if (res.data?.cedula) {
        setPaciente(res.data);
      } else {
        console.warn("⚠️ El backend no devolvió datos completos del paciente.");
        setPaciente({ cedula }); // fallback mínimo
      }
    
      return axios.get(`http://localhost:5000/api/historia-clinica/${subdominio}/${cedula}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    })
    
      .then(res => {
        console.log("📋 Historia clínica recibida:", res.data);
        setHistoriaClinica(Array.isArray(res.data) ? res.data : []);
      })
      .catch(error => {
        console.error("❌ Error al cargar historia clínica o paciente:", error);
      });
  }, [subdominio, cedula]);

  useEffect(() => {
    const meshes = allMeshes.current;
    Object.values(meshes).forEach(mesh => {
      mesh.visible = false;
    });

    if (!historiaClinica || historiaClinica.length === 0) {
      console.warn("⚠️ Historia clínica vacía, no se muestra nada.");
      return;
    }

    historiaClinica.forEach(({ diente, tratamientos, presente }) => {
      if (!presente) return;

      if (tratamientos.includes("Endodoncia")) {
        [`${diente}_endo`, `${diente}_r`].forEach(layer => {
          if (meshes[layer]) meshes[layer].visible = true;
        });
      }

      if (tratamientos.includes("Calza (Caries)")) {
        const caries = `${diente}_caries`;
        if (meshes[caries]) meshes[caries].visible = true;
      }

      if (tratamientos.length === 0 || (!tratamientos.includes("Endodoncia") && !tratamientos.includes("Calza (Caries)"))) {
        if (meshes[diente]) meshes[diente].visible = true;
      }
    });
  }, [historiaClinica]);

  const handleToothClick = (e) => {
    e.stopPropagation();
    if (!e.object.isMesh) return;

    const baseName = e.object.name.replace(/(_caries|_endo|_r)/g, "");
    setSelectedTooth(baseName);

    const data = historiaClinica.find(d => d.diente === baseName) || {};
    setPresente(data.presente ?? true);
    setEndodoncia(data.tratamientos?.includes("Endodoncia") || false);
    setCalza(data.tratamientos?.includes("Calza (Caries)") || false);

    Object.keys(allMeshes.current).forEach(nombre => {
      if (nombre.startsWith(baseName)) {
        allMeshes.current[nombre].visible = false;
      }
    });

    setOpen(true);
  };

  const handleSave = async () => {
    if (!selectedTooth || !paciente) return;

    const updated = historiaClinica.filter(item => item.diente !== selectedTooth);

    const tratamientos = [];
    if (presente) {
      if (endodoncia) tratamientos.push("Endodoncia");
      if (calza) tratamientos.push("Calza (Caries)");
    }

    updated.push({ diente: selectedTooth, tratamientos, presente });
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
