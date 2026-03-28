const { tasks, getNextId } = require("./data");

// Categorías mínimas
const categories = ["estudio", "trabajo", "personal"];

// Formato
function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

// Agregar tarea
function addTask(title, description, category) {
    category = category.toLowerCase();

    if (!categories.includes(category)) {
        console.log("❌ Categoría no válida.");
        return;
    }

    const task = {
        id: getNextId(),
        title,
        description,
        category,
        completed: false
    };

    tasks.push(task);
    console.log("✅ Tarea agregada correctamente.");
}

// Listar todas las tareas
function listTasks() {
    if (tasks.length === 0) {
        console.log("📭 No hay tareas.");
        return;
    }

    console.log("\n📋 Lista de tareas:");
    tasks.forEach(task => {
        console.log(
            `[${task.completed ? "✔" : " "}] ID: ${task.id} | ${task.title} (${capitalizar(task.category)})`
        );
    });
}

// Listar por categoría
function listByCategory(category) {
    const filtered = tasks.filter(t => t.category.toLowerCase() === category.toLowerCase());

    if (filtered.length === 0) {
        console.log("No hay tareas en esta categoría.");
        return;
    }

    console.log(`\n📂 Tareas en ${capitalizar(category)}:`);
    filtered.forEach(t => {
        console.log(`[${t.completed ? "✔" : " "}] ${t.title}`);
    });
}

// Marcar como completada
function completeTask(id) {
    const task = tasks.find(t => t.id == id);

    if (!task) {
        console.log("❌ Tarea no encontrada.");
        return;
    } 

    task.completed = true;
    console.log("✅ Tarea completada.");
}

// Agrupar por categoría (diccionario)
function groupByCategory() {
    const grouped = {};

    categories.forEach(cat => {
        grouped[cat] = tasks.filter(t => t.category === cat);
    });

    console.log("\n Tareas agrupadas:");
    console.log(grouped);
}

module.exports = {
  addTask,
  listTasks,
  completeTask,
  listByCategory,
  groupByCategory
};