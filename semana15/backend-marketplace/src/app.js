const express = require("express");
const cors = require("cors");
const productsRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");
const authRouter = require("./routes/auth");

const app = express();

// Configurar CORS
const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim().replace(/\/$/, ''))
    : '*';

const corsOptions = {
    origin: function (origin, callback) {
        // Permitir peticiones sin origen (como curl o apps móviles)
        if (!origin) return callback(null, true);
        
        // Permitir si coincide con las configuradas o si es *
        if (corsOrigins === '*' || corsOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        // Permitir dominios de vista previa de Vercel del proyecto
        const isVercelPreview = origin.endsWith('.vercel.app') && 
            (origin.includes('solisgeraldine') || origin.includes('frontend-marketplace'));
            
        if (isVercelPreview) {
            return callback(null, true);
        }
        
        callback(new Error('No permitido por la política CORS'));
    },
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);

app.get("/", (req, res) => {
    res.json({ message: "AOI E-comerce funcionando" });
});

app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada" });
});

module.exports = app;