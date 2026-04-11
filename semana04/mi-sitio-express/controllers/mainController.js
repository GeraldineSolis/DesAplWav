const home =  (req, res) => {
    res.render("home", { title: "Inicio" });
  };

const about = (req, res) => {
    res.render("about", { title: "Acerca de" });
  };

const mainController = {
  home, about
};

module.exports = mainController;
