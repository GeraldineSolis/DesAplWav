const http = require("http");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const PORT = 3000;

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        const filePath = path.join(__dirname, "views", "home.hbs");

        fs.readFile(filePath, "utf8", (err, templateData) => {
            if (err) {
                res.statusCode = 500;
                res.end("Error interno del servidor");
                return;
            }

            const template = handlebars.compile(templateData);

            const data = {
                title: "Servidor con Handlebars 🚀",
                welcomeMessage: "Bienvenido al laboratorio de Node.js",
                day: new Date().toLocaleDateString("es-PE"),
                students: ["Ana", "Luis", "Pedro", "María"],
            };

            const html = template(data);

            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(html);
        });
    } else if (req.url === "/about") {
        const filePath = path.join(__dirname, "views", "about.hbs");

        fs.readFile(filePath, "utf8", (err, templateData) => {
            if (err) {
                res.statusCode = 500;
                res.end("Error interno del servidor");
                return;
            }

            const template = handlebars.compile(templateData);

            const data = {
                title: "Acerca de la clase",
                course: "Desarrollo de Aplicaciones Web",
                teacher: "Ing. Juan Pérez",
                date: new Date().toLocaleDateString("es-PE")
            };

            const html = template(data);

            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(html);
        });
    } else if (req.url === "/students") {
        const filePath = path.join(__dirname, "views", "students.hbs");

        fs.readFile(filePath, "utf8", (err, templateData) => {
            if (err) {
                res.statusCode = 500;
                res.end("Error interno del servidor");
                return;
            }

            const template = handlebars.compile(templateData);

            const studentsData = [
                { name: "Ana", grade: 18 },
                { name: "Luis", grade: 15 },
                { name: "Pedro", grade: 12 },
                { name: "María", grade: 20 }
            ];

            const students = studentsData.map(s => ({
                ...s,
                highlight: s.grade > 15
            }));

            const data = {
                title: "Lista de Estudiantes",
                students: students
            };

            const html = template(data);

            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(html);
        });
    } else {
        res.statusCode = 404;
        res.end("<h1>404 - Página no encontrada</h1>");
    }
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});