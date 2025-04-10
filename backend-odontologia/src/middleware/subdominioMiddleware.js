const verificarSubdominio = (req, res, next) => {
  const host = req.headers.host;
  const subdominio = host.split(".")[0]; // Extrae el subdominio (ej: "dentalgesia")

  if (!subdominio || subdominio === "www" || subdominio === "localhost") {
    return res.status(403).json({ mensaje: "Acceso denegado: Subdominio no detectado" });
  }

  req.subdominio = subdominio;
  next();
};

module.exports = verificarSubdominio;
