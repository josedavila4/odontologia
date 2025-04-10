import { createContext, useContext, useState } from "react";

const PatientContext = createContext();

export const usePatient = () => useContext(PatientContext);

export const PatientProvider = ({ children }) => {
  const [pacientes, setPacientes] = useState([]);

  const updatePatient = (updatedPatient) => {
    console.log("✅ updatePatient ejecutado con:", updatedPatient);
    setPacientes((prevPacientes) =>
      prevPacientes.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
  };

  return (
    <PatientContext.Provider value={{ pacientes, setPacientes, updatePatient }}>
      {children}
    </PatientContext.Provider>
  );
};
