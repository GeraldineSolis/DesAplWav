const express = require("express");
const cors = require("cors");
const productsRouter = require("./routes/products");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productsRouter);

app.get("/", (req, res) => {
    res.json({ message: "AOI E-comerce funcionando" });
});

app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada" });
});

module.exports = app;