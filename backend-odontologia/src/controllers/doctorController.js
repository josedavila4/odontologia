const obtenerCitas = async (req, res) => {
  try {
    const consultorio = req.subdominio; // Subdominio detectado

    const citas = await pool.query(
      "SELECT * FROM citas WHERE consultorio_id = (SELECT id FROM consultorios WHERE nombre = $1)",
      [consultorio]
    );

    res.json(citas.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener las citas" });
  }
};
