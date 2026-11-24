
//  PRUEBAS UNITARIAS DE TASKFLOW


let pasaron = 0;
let fallaron = 0;

// Revisa una condición. Si es false, lanza un error con el mensaje.
function esperar(condicion, mensaje) {
    if (!condicion) {
        throw new Error(mensaje);
    }
}

// Ejecuta una prueba 
function probar(nombre, funcionDePrueba) {
    const item = document.createElement("li");
    item.className = "list-group-item";

    try {
        funcionDePrueba();
        item.textContent = `✅ ${nombre}`;
        item.classList.add("list-group-item-success");
        pasaron++;
    } catch (error) {
        item.textContent = `❌ ${nombre} → ${error.message}`;
        item.classList.add("list-group-item-danger");
        fallaron++;
    }

    document.getElementById("resultados").append(item);
}

// Una tarea para no repetir lo mismo en cada prueba.
function crearTareaDePrueba() {
    return {
        nombre: "Tarea de prueba",
        descripcion: "Descripción de prueba larga",
        asignadoA: "Jennyfer Prueba",
        fechaDeEntrega: "2026-12-01",
        estado: "POR HACER",
    };
}

// Las pruebas de pantalla llaman a save() y tocan localStorage.
// Hacemos una copia de seguridad para no perder tus tareas reales.
const copiaTareas = localStorage.getItem("tareas");
const copiaId = localStorage.getItem("currentId");

// --- 1. Pruebas de la clase TaskManager ---
// Cada prueba usa un TaskManager NUEVO y vacío, así no se mezclan.

probar("addTask agrega una tarea con id 1", () => {
    const manager = new TaskManager();

    manager.addTask(crearTareaDePrueba());

    esperar(manager.tasks.length === 1, "debería haber 1 tarea");
    esperar(manager.tasks[0].id === 1, "el id debería ser 1");
    esperar(manager.tasks[0].nombre === "Tarea de prueba", "el nombre no coincide");
});

probar("deleteTask elimina la tarea", () => {
    const manager = new TaskManager();
    const tarea = manager.addTask(crearTareaDePrueba());

    manager.deleteTask(tarea.id);

    esperar(manager.tasks.length === 0, "debería quedar 0 tareas");
});

probar("updateTask cambia el estado", () => {
    const manager = new TaskManager();
    const tarea = manager.addTask(crearTareaDePrueba());

    manager.updateTask(tarea.id, "HECHO");

    esperar(manager.getTaskById(tarea.id).estado === "HECHO", "el estado debería ser HECHO");
});

probar("assignTask cambia la persona asignada", () => {
    const manager = new TaskManager();
    const tarea = manager.addTask(crearTareaDePrueba());

    manager.assignTask(tarea.id, "Maria Lopez");

    esperar(manager.getTaskById(tarea.id).asignadoA === "Maria Lopez", "asignadoA debería ser Maria Lopez");
});

// Usamos el taskManager real de app.js, porque el botón Eliminar lo usa.

probar("UI: al agregar, la tarjeta aparece en #listaTareas", () => {
    const tarea = taskManager.addTask(crearTareaDePrueba());

    taskManager.render();

    const tarjeta = document.querySelector(`#listaTareas [data-id="${tarea.id}"]`);
    esperar(tarjeta !== null, "la tarjeta no aparece en la lista");
});

probar("UI: al eliminar, la tarjeta desaparece de #listaTareas", () => {
    const tarea = taskManager.addTask(crearTareaDePrueba());
    taskManager.render();

    // hacemos clic en su botón Eliminar
    const tarjeta = document.querySelector(`#listaTareas [data-id="${tarea.id}"]`);
    tarjeta.querySelector(".btn-eliminar").click();

    const tarjetaDespues = document.querySelector(`#listaTareas [data-id="${tarea.id}"]`);
    esperar(tarjetaDespues === null, "la tarjeta sigue en la lista");
});

// --- 3. Devolver tus tareas reales a localStorage ---
if (copiaTareas === null) {
    localStorage.removeItem("tareas");
} else {
    localStorage.setItem("tareas", copiaTareas);
}
if (copiaId === null) {
    localStorage.removeItem("currentId");
} else {
    localStorage.setItem("currentId", copiaId);
}

// --- 4. Resumen ---
document.getElementById("resumen").textContent =
    `Pasaron: ${pasaron} ✅   Fallaron: ${fallaron} ❌`;
