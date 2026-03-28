const readline = require("readline");
const {
  addTask,
  listTasks,
  completeTask,
  listByCategory,
  groupByCategory
} = require("./functions");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Menú
function showMenu() {
    console.log(`
1. Agregar tarea
2. Listar tareas
3. Completar tarea
4. Listar por categoría
5. Agrupar por categoría
6. Salir
  `);

    rl.question("Selecciona una opción: ", option => {
        switch (option) {
            case "1":
                rl.question("Título: ", title => {
                    rl.question("Descripción: ", description => {
                        rl.question("Categoría (Estudio/Trabajo/Personal): ", category => {
                            addTask(title, description, category);
                            showMenu();
                        });
                    });
                });
                break;

            case "2":
                listTasks();
                showMenu();
                break;

            case "3":
                rl.question("ID de la tarea: ", id => {
                    completeTask(id);
                    showMenu();
                });
                break;

            case "4":
                rl.question("Categoría: ", category => {
                    listByCategory(category);
                    showMenu();
                });
                break;

            case "5":
                groupByCategory();
                showMenu();
                break;

            case "6":
                console.log("Saliendo...");
                rl.close();
                break;

            default:
                console.log("❌ Opción inválida.");
                showMenu();
        }
    });
}

showMenu();