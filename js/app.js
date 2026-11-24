class TaskManager {
    constructor() {
        this.tasks = []; // guardan las tareas
        this.currentId = 0;
    }

    getAllTasks() {
        return this.tasks;
    }

    getTasksWithStatus(status) {
        return this.tasks.filter((task) => task.estado === status);
    }

    addTask(task) {
        this.currentId++;
        const nuevaTarea = {
            id: this.currentId,
            nombre: task.nombre,
            descripcion: task.descripcion,
            asignadoA: task.asignadoA,
            fechaDeEntrega: task.fechaDeEntrega,
            estado: task.estado,
        };
        this.tasks.push(nuevaTarea);
        return nuevaTarea;
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
    }

    // Cambia el estado de una tarea
    updateTask(taskId, status) {
        const task = this.tasks.find((task) => task.id === taskId);
        if (task) {
            task.estado = status;
        }
    }

    // Cambia la persona asignada de una tarea
    assignTask(taskId, assignee) {
        const task = this.tasks.find((task) => task.id === taskId);
        if (task) {
            task.asignadoA = assignee;
        }
    }
    // Método de la clase dibuje todas las tarjetas a partir de this.task
    render() {
        const contenedor = document.getElementById("listaTareas");
        contenedor.innerHTML = "";

        for (const task of this.tasks) {
            const tarjeta = crearTarjeta(task);
            contenedor.append(tarjeta);
        }
    }
    // Busca en el array la tarea que tenga ese id
    getTaskById(taskId) {
        let tareaEncontrada;

        for (const task of this.tasks) {
            if (task.id === taskId) {
                tareaEncontrada = task;
            }
        }

        return tareaEncontrada;
    }
    // Guarda las tareas y el contador en localStorage
    save() {
        const tareasEnTexto = JSON.stringify(this.tasks);
        localStorage.setItem("tareas", tareasEnTexto);

        const idEnTexto = String(this.currentId);
        localStorage.setItem("currentId", idEnTexto);
    }
    load() {
        const tareasGuardadas = localStorage.getItem("tareas");
        if (tareasGuardadas !== null) {
            this.tasks = JSON.parse(tareasGuardadas);
        }

        const idGuardado = localStorage.getItem("currentId");
        if (idGuardado !== null) {
            this.currentId = Number(idGuardado);
        }
    }
}

const taskManager = new TaskManager();
taskManager.load(); // Llena el LS
taskManager.render(); // dibujar tarjetas

function validateTaskForm() {
    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const asignadoA = document.getElementById("asignadoA").value.trim();
    const fechaEntrega = document.getElementById("fechaEntrega").value.trim();
    const estado = document.getElementById("estado").value;

    const errores = [];

    if (nombre.length <= 4) {
        errores.push("El nombre de la tarea debe tener más de 4 caracteres.");
    }

    if (descripcion.length <= 15) {
        errores.push("La descripción debe tener más de 15 caracteres.");
    }

    if (asignadoA.length <= 8) {
        errores.push("El campo 'Asignado a' debe tener más de 8 caracteres.");
    }

    if (fechaEntrega === "") {
        errores.push("Debes elegir una fecha de entrega.");
    }

    if (estado === "") {
        errores.push("Debes seleccionar un estado.");
    }

    mostrarErrores(errores);

    return errores.length === 0;
}

function mostrarErrores(errores) {
    const cajaErrores = document.getElementById("errores");

    if (errores.length === 0) {
        cajaErrores.classList.add("d-none");
        cajaErrores.innerHTML = "";
        return;
    }

    cajaErrores.innerHTML =
        "<ul class='mb-0'>" +
        errores.map((error) => `<li>${error}</li>`).join("") +
        "</ul>";

    cajaErrores.classList.remove("d-none");
}

function crearTarjeta(task) {
    const tarjeta = document.createElement("div");
    tarjeta.className = "col-md-4";
    let botonCompletar = "";
    if (task.estado !== "HECHO") {
        botonCompletar = `<button class="btn btn-success btn-sm btn-completar">Marcar como hecha</button>`;
    }
    tarjeta.innerHTML = `
        <div class="card h-100 shadow-sm" data-estado="${task.estado}"  data-id="${task.id}">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title mb-0">${task.nombre}</h5>
              <span class="badge bg-dark">${task.estado}</span>
            </div>
            <p class="card-text text-secondary">${task.descripcion}</p>
            <p class="mb-1">👤 <strong>Asignado a:</strong> ${task.asignadoA}</p>
            <p class="mb-0">📅 <strong>Entrega:</strong> ${task.fechaDeEntrega}</p>
          </div>
          <div class="card-footer bg-transparent d-flex justify-content-between
  align-items-center">
            <small class="text-muted">ID: ${task.id}</small>
             ${botonCompletar}
            <button class="btn btn-outline-danger btn-sm btn-eliminar">Eliminar</button>
          </div>
        </div>
    `;

    const botonEliminar = tarjeta.querySelector(".btn-eliminar");

    botonEliminar.addEventListener("click", () => {
        taskManager.deleteTask(task.id);
        tarjeta.remove();
        taskManager.save();
    });

    return tarjeta;
}

const formulario = document.getElementById("formTarea");

formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateTaskForm()) {
        return;
    }

    const nuevaTarea = {
        nombre: document.getElementById("nombre").value.trim(),
        descripcion: document.getElementById("descripcion").value.trim(),
        asignadoA: document.getElementById("asignadoA").value.trim(),
        fechaDeEntrega: document.getElementById("fechaEntrega").value,
        estado: document.getElementById("estado").value,
    };

    taskManager.addTask(nuevaTarea); // anotar en el cuaderno
    taskManager.render();
    taskManager.save();
    formulario.reset();
});
// ocultamos los errores
formulario.addEventListener("input", () => {
    mostrarErrores([]);
});
// solo addEventListener en #listaTareas
const listaTareas = document.querySelector("#listaTareas");

listaTareas.addEventListener("click", (event) => {
    // ¿El clic fue en el botón verde?
    if (event.target.classList.contains("btn-completar")) {
        // Subimos 2 niveles: botón → footer → card
        const elementoTarea = event.target.parentElement.parentElement;
        const id = Number(elementoTarea.dataset.id); // leer id del html y convertir a número
        const tarea = taskManager.getTaskById(id); // buscar
        tarea.estado = "HECHO"; // cambiar estado
        taskManager.render(); // redibujar;
        taskManager.save();
    }
});
