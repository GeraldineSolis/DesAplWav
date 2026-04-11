const http = require("http");
const repo = require("./repository/studentsRepository");

const PORT = 4000;

const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/json; chatset=utf-8");
    const { method, url } = req;

    if (url === "/students" && method === "GET") {
        res.statusCode = 200;
        res.end(JSON.stringify(repo.getAll()));
    }

    else if (url.startsWith("/students/") && method == "GET") {
        const id = parseInt(url.split("/")[2]);
        const student = repo.getById(id);

        if (student) {
            res.statusCode = 200;
            res.end(JSON.stringify(student));
        } else {
            res.statusCode = 404;
            res.end(json.stringify({ error: "Estudiante no encontrado "}));
        }
    }

    else if (url === "/students" && method === "POST") {
        let body = "";
        req.on("data", chunk => (body += chunk));
        req.on("end", () => {
            try {
                const newStudent = JSON.parse(body);
                const createdStudent = repo.create(newStudent);
                res.statusCode = 201;
                res.end(JSON.stringify(createdStudent));
            } catch (error) {
                res.statusCode = 400; // Bad Request
                res.end(JSON.stringify({ error: error.message }));
            }
        });
    }

    else if (url.startsWith("/students/") && method === "PUT") {
        const id = parseInt(url.split("/")[2]);
        let body = "";
        req.on("data", chunk => (body += chunk));
        req.on("end", () => {
            const updated = repo.update(id, JSON.parse(body));
            if (updated) {
                res.statusCode = 200;
                res.end(JSON.stringify(updated));
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
            }
        });
    }

    else if (url.startsWith("/students/") && method === "DELETE") {
        const id = parseInt(url.split("/")[2]);
        const deleted = repo.remove(id);

        if (deleted) {
            res.statusCode = 200;
            res.end(JSON.stringify(deleted));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
        }
    } 

    else if (url === "/ListByStatus" && method === "POST") {
        let body = "";
        req.on("data", chunk => {
            body += chunk;
        });
        req.on("end", () => {
            try {                
                const parsedBody = JSON.parse(body);
                const status = parsedBody.status;

                if (!status) {
                    res.statusCode = 400;
                    return res.end(JSON.stringify({ error: "El campo 'status' es obligatorio" }));
                }

                const filtered = repo.listByStatus(status);
                res.statusCode = 200;
                res.end(JSON.stringify(filtered));

            } catch (error) {
                console.error("Error al parsear:", error.message);
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "JSON inválido", detalle: error.message }));
            }
        });
        return; 
    }

    else if (url === "/ListByGrade" && method === "POST") {
        let body = "";
        req.on("data", chunk => (body += chunk));
        req.on("end", () => {
            try {
                const { gpa } = JSON.parse(body);
                if (gpa === undefined || isNaN(gpa)) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: "El campo 'gpa' debe ser un número" }));
                    return;
                }
                const filtered = repo.listByGrade(parseFloat(gpa));
                res.statusCode = 200;
                res.end(JSON.stringify(filtered));
            } catch (error) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "JSON inválido" }));
            }
        });
    }

    else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Ruta no encontrada" }));
    }
});

server.listen(PORT, () => {
    console.log(`API corriendo en http://localhost:${PORT}`)
});