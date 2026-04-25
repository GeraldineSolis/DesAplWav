import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import connectDB from "./src/db/database.js";
import dotenv from "dotenv";
import seedUser from "./src/seeds/userSeeder.js";
dotenv.config(); // carga las variables desde .env

//rutas
import homeRoutes from "./src/routes/home.routes.js";
import postRoutes from "./src/routes/post.routes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src","views"));

// Middlewares
app.use(express.urlencoded({ extended: true })); // Para leer datos de formularios
app.use(express.json()); // Para leer JSON
app.use(express.static(path.join(__dirname,"src"))); // Archivos estáticos (css, js, imgs)
app.use(express.static(path.join(__dirname, "public")));

// Rutas
app.use("/", homeRoutes);
app.use("/posts", postRoutes);

const startServer = async () => {
    try {
        await connectDB();
        
        await seedUser();

        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
        
    } catch (error) {
        console.error("❌ Error al iniciar la aplicación:", error);
    }
};

startServer();