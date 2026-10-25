  class TaskManager {
    constructor() {
      this.tasks = [];     // guardan las tareas 
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
  }


  const taskManager = new TaskManager();

function validateTaskForm() {
  const nombre = document.getElementById("nombre").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const asignadoA = document.getElementById("asignadoA").value.trim();
  const fechaEntrega = document.getElementById("fechaEntrega").value.trim();
  const estado = document.getElementById("estado").value;

  const errores = []; 

  if (nombre.length <= 8) {
   errores.push("El nombre debe tener más de 8 caracteres.");
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

    cajaErrores.innerHTML = "<ul class='mb-0'>" +
      errores.map(error => `<li>${error}</li>`).join("") +
      "</ul>";

    cajaErrores.classList.remove("d-none"); 
  }

   function crearTarjeta(task) {
    const tarjeta = document.createElement("div");
    tarjeta.className = "col-md-4";

    tarjeta.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${task.nombre}</h5>
          <p class="card-text">${task.descripcion}</p>
          <p class="mb-1"><strong>Asignado a:</strong> ${task.asignadoA}</p>
          <p class="mb-1"><strong>Fecha de entrega:</strong> ${task.fechaDeEntrega}</p>
          <p class="mb-1"><strong>Estado:</strong> ${task.estado}</p>
          <small class="text-muted">ID: ${task.id}</small>
        </div>
        <div class="card-footer bg-transparent border-0">
          <button class="btn btn-danger btn-sm btn-eliminar">Eliminar</button>
        </div>
      </div>
    `; 

    const botonEliminar = tarjeta.querySelector(".btn-eliminar");

    botonEliminar.addEventListener("click", () => {
      taskManager.deleteTask(task.id); 
      tarjeta.remove();                
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

    const tareaGuardada = taskManager.addTask(nuevaTarea);
    const tarjeta = crearTarjeta(tareaGuardada);
    document.getElementById("listaTareas").append(tarjeta);
    formulario.reset();
  });
