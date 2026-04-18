const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");
const juegosController = require("../controllers/JuegosController");

// Definir rutas y asociarlas con controladores
router.get("/", mainController.home);
router.get("/about", mainController.about);
router.get("/contact", mainController.contact);
router.post("/contact", mainController.saveContact);
router.get("/admin", mainController.admin);

router.get("/juegos", juegosController.juegos);
router.post("/juegos", juegosController.saveJuego);

module.exports = router;
