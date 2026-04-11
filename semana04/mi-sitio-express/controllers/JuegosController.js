const listaJuegos = [];

const juegos = (req, res) => {
  res.render("juegos", { listaJuegos });
};

const saveJuego = (req, res) => {
  const { titulo, plataforma, genero, calificacion, anio } = req.body;
  listaJuegos.push({ titulo, plataforma, genero, calificacion, anio });
  res.redirect('/juegos');
};

const juegosController = {

  juegos,
  saveJuego
};

module.exports = juegosController;
