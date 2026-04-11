const home =  (req, res) => {
    res.render("home", { title: "Inicio" });
  };

const about = (req, res) => {
    res.render("about", { title: "Acerca de" });
  };

// "Base de datos" en memoria
const messages = [];
const listaJuegos = [];

const contact = (req, res) => {
    res.render("contact");
}

const saveContact = (req, res) => {
  const { nombre, email, mensaje } = req.body;

  // Guardar en memoria
  messages.push({ nombre, email, mensaje });

  // Redirigir a inicio para ver los mensajes
  res.redirect('/admin');
};

const admin  = (req, res) => {
  res.render("admin", { messages });
};


const juegos = (req, res) => {
  res.render("juegos", { listaJuegos });
}

const saveJuego = (req, res) => {
  const { titulo, plataforma, genero, calificacion, anio } = req.body;
  listaJuegos.push({ titulo, plataforma, genero, calificacion, anio });
  res.redirect('/juegos');
};


const mainController = {
  home, 
  about, 
  contact,
  saveContact,
  admin,
  juegos,
  saveJuego
};

module.exports = mainController;
