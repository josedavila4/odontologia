const { crearConsultorio, obtenerConsultorios } = require("../models/consultorioModel");

// Registrar un consultorio
const registrarConsultorio = async (req, res) => {
  const { nombre, direccion, telefono } = req.body;
  
  if (!nombre || !direccion || !telefono) {
    return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
  }

  try {
    const consultorio = await crearConsultorio(nombre, direccion, telefono);
    res.status(201).json(consultorio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al registrar el consultorio" });
  }
};

// Obtener todos los consultorios
const listarConsultorios = async (req, res) => {
  try {
    const consultorios = await obtenerConsultorios();
    res.json(consultorios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener los consultorios" });
  }
};

module.exports = { registrarConsultorio, listarConsultorios };
