// Add this error handler at the beginning of the script section
// Global error handler to catch and log errors properly
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Error: ' + message + ' at ' + source + ':' + lineno + ':' + colno, error);
  return true; // Prevent default handling
};

/* ==========================================================================
   SECCIÓN 1: VARIABLES GLOBALES Y ELEMENTOS DEL DOM
   Aquí seleccionamos todos los botones, formularios y contenedores que vamos a usar.
   ========================================================================== */

// Variables globales de estado
let selectedRole = null;

// Elementos Generales
const roleSelection = document.getElementById('role-selection');
const loginSection = document.getElementById('login-section');
const loginRoleText = document.getElementById('login-role-text');
const loginForm = document.getElementById('login-form');
const backToRoleBtn = document.getElementById('back-to-role');
const profesorDashboard = document.getElementById('profesor-dashboard');
const estudianteDashboard = document.getElementById('estudiante-dashboard');
const roleCards = document.querySelectorAll('.role-card');

// Elementos del Dashboard Profesor
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const dashboardSections = document.querySelectorAll('.dashboard-section');
const addQuestionBtn = document.getElementById('add-question-btn');
const questionsContainer = document.getElementById('questions-container');
const createTaskForm = document.getElementById('create-task-form');

// Elementos del Dashboard Estudiante
const studentTasksList = document.getElementById('student-tasks-list');
const studentTaskView = document.getElementById('student-task-view');
const loadingView = document.getElementById('loading-view');
const resultsView = document.getElementById('results-view');
const startTaskBtns = document.querySelectorAll('.start-task');
const backToTasksBtns = document.querySelectorAll('.back-to-tasks');
const finishTaskBtn = document.getElementById('finish-task-btn');
const viewResultsBtns = document.querySelectorAll('.view-results');


/* ==========================================================================
   SECCIÓN 2: LÓGICA DE INICIO (SELECCIÓN DE ROL Y LOGIN)
   Maneja los clics en "Profesor/Estudiante" y el formulario de ingreso.
   ========================================================================== */

// Event Listeners - Selección de rol
roleCards.forEach(card => {
  card.addEventListener('click', () => {
    selectedRole = card.dataset.role;
    roleCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    
    setTimeout(() => {
      roleSelection.classList.add('hidden');
      loginSection.classList.remove('hidden');
      loginRoleText.textContent = `Como ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`;
    }, 300);
  });
});


// Volver a selección de rol
backToRoleBtn.addEventListener('click', () => {
  loginSection.classList.add('hidden');
  roleSelection.classList.remove('hidden');
  roleCards.forEach(c => c.classList.remove('selected'));
  loginForm.reset();
});


// Login (Simulado)
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Simular login exitoso
  loginSection.classList.add('hidden');
  
  if (selectedRole === 'profesor') {    
    // Obtener el email y extraer el nombre para mostrarlo en el dashboard
    const email = document.getElementById('email').value;
    let profesorName = "Usuario";
    
    // Extraer un nombre a partir del correo electrónico
    if (email) {
      const namePart = email.split('@')[0];
      // Convertir a formato de nombre propio (primera letra mayúscula)
      if (namePart.includes('.')) {
        // Si tiene formato nombre.apellido
        const parts = namePart.split('.');
        profesorName = parts.map(part => 
          part.charAt(0).toUpperCase() + part.slice(1)
        ).join(' ');
      } else {
        profesorName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      }
    }
    
    // Actualizar el nombre y las iniciales en el dashboard
    const nameSpan = profesorDashboard.querySelector('.fw-bold');
    const avatarDiv = profesorDashboard.querySelector('.avatar');
    
    if (nameSpan) nameSpan.textContent = profesorName;
    if (avatarDiv) {
      // Obtener iniciales (máximo 2)
      const initials = profesorName.split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
      avatarDiv.textContent = initials;
    }
    
    profesorDashboard.classList.remove('hidden');
  } else if (selectedRole === 'estudiante') {    
    estudianteDashboard.classList.remove('hidden');
    // Renderizar tareas al iniciar sesión como estudiante
    renderStudentTasks();
  }
});


/* ==========================================================================
   SECCIÓN 3: FUNCIONALIDAD DEL PROFESOR
   Maneja la navegación del menú lateral, creación de tareas y preguntas.
   ========================================================================== */

// Dashboard de profesor - Navegación Menú Lateral
sidebarLinks.forEach(link => {
  link.addEventListener('click', () => {
    const sectionId = link.dataset.section;
    
    if (sectionId === 'cerrar-sesion') {
      // Cerrar sesión
      profesorDashboard.classList.add('hidden');
      roleSelection.classList.remove('hidden');
      loginForm.reset();
      return;
    }
    
    // Actualizar enlaces activos
    sidebarLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    // Mostrar sección correspondiente
    dashboardSections.forEach(section => {
      section.classList.add('hidden');
    });
    
    document.getElementById(`${sectionId}-section`).classList.remove('hidden');
  });
});

// Agregar nueva pregunta al formulario
if (addQuestionBtn) {
  addQuestionBtn.addEventListener('click', () => {
    const questionCount = questionsContainer.children.length + 1;
    const questionId = Date.now(); // ID único para la pregunta
    
    const questionElement = document.createElement('div');
    questionElement.className = 'question-card';
    questionElement.dataset.questionId = questionId;
    
    questionElement.innerHTML = `
      <div class="mb-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <label class="form-label">Pregunta ${questionCount}</label>
          <select class="form-select form-select-sm w-auto question-type">
            <option value="multiple">Opción Múltiple</option>
            <option value="truefalse">Verdadero/Falso</option>
          </select>
        </div>
        <input type="text" class="form-control" placeholder="Escribe la pregunta aquí" required>
      </div>
      
      <div class="options-container">
        <div class="mb-2">
          <div class="input-group">
            <div class="input-group-text">
              <input type="radio" name="correct-${questionId}" checked>
            </div>
            <input type="text" class="form-control" placeholder="Opción A" required>
          </div>
        </div>
        
        <div class="mb-2">
          <div class="input-group">
            <div class="input-group-text">
              <input type="radio" name="correct-${questionId}">
            </div>
            <input type="text" class="form-control" placeholder="Opción B" required>
          </div>
        </div>
        
        <div class="mb-2">
          <div class="input-group">
            <div class="input-group-text">
              <input type="radio" name="correct-${questionId}">
            </div>
            <input type="text" class="form-control" placeholder="Opción C" required>
          </div>
        </div>
        
        <div class="mb-2">
          <div class="input-group">
            <div class="input-group-text">
              <input type="radio" name="correct-${questionId}">
            </div>
            <input type="text" class="form-control" placeholder="Opción D" required>
          </div>
        </div>
      </div>
      
      <div class="d-flex justify-content-end mt-2">
        <button type="button" class="btn btn-outline-danger btn-sm delete-question">
          <i class="fas fa-trash me-1"></i>Eliminar
        </button>
      </div>
    `;
    
    questionsContainer.appendChild(questionElement);
    
    // Agregar event listeners a los nuevos elementos
    const questionType = questionElement.querySelector('.question-type');
    const deleteBtn = questionElement.querySelector('.delete-question');
    
    questionType.addEventListener('change', function() {
      const optionsContainer = questionElement.querySelector('.options-container');
      
      if (this.value === 'truefalse') {
        optionsContainer.innerHTML = `
          <div class="mb-2">
            <div class="input-group">
              <div class="input-group-text">
                <input type="radio" name="correct-${questionId}" checked>
              </div>
              <input type="text" class="form-control" value="Verdadero" readonly>
            </div>
          </div>
          
          <div class="mb-2">
            <div class="input-group">
              <div class="input-group-text">
                <input type="radio" name="correct-${questionId}">
              </div>
              <input type="text" class="form-control" value="Falso" readonly>
            </div>
          </div>
        `;
      } else {
        optionsContainer.innerHTML = `
          <div class="mb-2">
            <div class="input-group">
              <div class="input-group-text">
                <input type="radio" name="correct-${questionId}" checked>
              </div>
              <input type="text" class="form-control" placeholder="Opción A" required>
            </div>
          </div>
          
          <div class="mb-2">
            <div class="input-group">
              <div class="input-group-text">
                <input type="radio" name="correct-${questionId}">
              </div>
              <input type="text" class="form-control" placeholder="Opción B" required>
            </div>
          </div>
          
          <div class="mb-2">
            <div class="input-group">
              <div class="input-group-text">
                <input type="radio" name="correct-${questionId}">
              </div>
              <input type="text" class="form-control" placeholder="Opción C" required>
            </div>
          </div>
          
          <div class="mb-2">
            <div class="input-group">
              <div class="input-group-text">
                <input type="radio" name="correct-${questionId}">
              </div>
              <input type="text" class="form-control" placeholder="Opción D" required>
            </div>
          </div>
        `;
      }
    });
    
    deleteBtn.addEventListener('click', function() {
      questionElement.remove();
      // Actualizar los números de las preguntas
      const questions = questionsContainer.querySelectorAll('.question-card');
      questions.forEach((q, index) => {
        q.querySelector('label').textContent = `Pregunta ${index + 1}`;
      });
    });
  });
}

// Cambiar tipo de pregunta en la primera pregunta (existente por defecto)
document.querySelectorAll('.question-type').forEach(select => {
  select.addEventListener('change', function() {
    const questionCard = this.closest('.question-card');
    const questionId = questionCard.dataset.questionId;
    const optionsContainer = questionCard.querySelector('.options-container');
    
    if (this.value === 'truefalse') {
      optionsContainer.innerHTML = `
        <div class="mb-2">
          <div class="input-group">
            <div class="input-group-text">
              <input type="radio" name="correct-${questionId}" checked>
            </div>
            <input type="text" class="form-control" value="Verdadero" readonly>
          </div>
        </div>
        
        <div class="mb-2">
          <div class="input-group">
            <div class="input-group-text">
              <input type="radio" name="correct-${questionId}">
            </div>
            <input type="text" class="form-control" value="Falso" readonly>
          </div>
        </div>
      `;
    } else {
      optionsContainer.innerHTML = `
        <div class="mb-2">
          <div class="input-group">
            <div class="input-group-text">
              <input type="radio" name="correct-${questionId}" checked>
            </div>
            <input type="text" class="form-control" placeholder="Opción A" required>
          </div>
        </div>
        
        <div class="mb-2">
          <div class="input-group">
            <div class="input-group-text">
              <input type="radio" name="correct-${questionId}">
            </div>
            <input type="text" class="form-control" placeholder="Opción B" required>
          </div>
        </div>
        
        <div class="mb-2">
          <div class="input-group">
            <div class="input-group-text">
              <input type="radio" name="correct-${questionId}">
            </div>
            <input type="text" class="form-control" placeholder="Opción C" required>
          </div>
        </div>
        
        <div class="mb-2">
          <div class="input-group">
            <div class="input-group-text">
              <input type="radio" name="correct-${questionId}">
            </div>
            <input type="text" class="form-control" placeholder="Opción D" required>
          </div>
        </div>
      `;
    }
  });
});

// Crear tarea (Guardar)
if (createTaskForm) {
  createTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Obtener los datos del formulario
    const taskTitle = document.getElementById('task-title').value;
    const taskDescription = document.getElementById('task-description').value;
    const taskDueDate = document.getElementById('task-due-date').value;
    
    // Formatear la fecha de YYYY-MM-DD a DD/MM/YYYY para mostrarla
    const formattedDate = new Date(taskDueDate).toLocaleDateString('es-ES');
    
    // Crear el HTML para la nueva tarea
    const newTaskHTML = `
      <div class="col-md-6">
        <div class="content-card task-card h-100">
          <div class="d-flex justify-content-between mb-2">
            <h3 class="h5">${taskTitle}</h3>
            <span class="badge bg-warning text-dark">Pendiente</span>
          </div>
          <p class="text-muted small mb-2">Fecha de entrega: ${formattedDate}</p>
          <p class="mb-3">${taskDescription}</p>
          <div class="d-flex justify-content-end">
            <button class="btn btn-sm btn-outline-primary me-2">
              <i class="fas fa-edit me-1"></i>Editar
            </button>
            <button class="btn btn-sm btn-outline-danger">
              <i class="fas fa-trash me-1"></i>Eliminar
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Agregar la nueva tarea al contenedor de tareas existentes
    const tasksContainer = document.querySelector('#tareas-section .row');
    tasksContainer.insertAdjacentHTML('afterbegin', newTaskHTML);
    
    // Añadir event listeners a los nuevos botones
    const newTaskCard = tasksContainer.querySelector('.col-md-6:first-child');
    const editBtn = newTaskCard.querySelector('.btn-outline-primary');
    const deleteBtn = newTaskCard.querySelector('.btn-outline-danger');
    
    deleteBtn.addEventListener('click', function() {
      if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        newTaskCard.remove();
        renderStudentTasks();
      }
    });
    
    editBtn.addEventListener('click', function() {
      // Obtener datos de la tarea para edición
      const card = this.closest('.task-card');
      const taskTitle = card.querySelector('h3').textContent;
      const taskDueDate = card.querySelector('.text-muted').textContent.replace('Fecha de entrega: ', '');
      const taskDescription = card.querySelector('p:not(.text-muted)').textContent;
      
      // Redirigir a la sección de edición (reutilizando la sección de crear tarea)
      dashboardSections.forEach(section => {
        section.classList.add('hidden');
      });
      document.getElementById('crear-tarea-section').classList.remove('hidden');
      
      // Actualizar enlaces activos
      sidebarLinks.forEach(l => l.classList.remove('active'));
      document.querySelector('[data-section="crear-tarea"]').classList.add('active');
      
      // Prellenar el formulario con los datos de la tarea
      document.getElementById('task-title').value = taskTitle;
      document.getElementById('task-description').value = taskDescription;
      // Convertir fecha de formato DD/MM/YYYY a YYYY-MM-DD para el input date
      const dateParts = taskDueDate.split('/');
      if (dateParts.length === 3) {
        document.getElementById('task-due-date').value = 
          `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
      }
    });
    
    // Actualizar la lista de tareas del estudiante
    renderStudentTasks();
    
    // Resetear el formulario
    createTaskForm.reset();
    
    // Cambiar a la sección de tareas existentes
    dashboardSections.forEach(section => {
      section.classList.add('hidden');
    });
    document.getElementById('tareas-section').classList.remove('hidden');
    
    // Actualizar enlaces activos en la barra lateral
    sidebarLinks.forEach(l => l.classList.remove('active'));
    document.querySelector('[data-section="tareas"]').classList.add('active');
  });
  
  // Agregar funcionalidad al botón Cancelar
  const cancelTaskBtn = document.querySelector('#crear-tarea-section .btn-outline-secondary');
  if (cancelTaskBtn) {
    cancelTaskBtn.addEventListener('click', function() {
      // Resetear el formulario
      createTaskForm.reset();
      
      // Cambiar a la sección de tareas existentes
      dashboardSections.forEach(section => {
        section.classList.add('hidden');
      });
      document.getElementById('tareas-section').classList.remove('hidden');
      
      // Actualizar enlaces activos en la barra lateral
      sidebarLinks.forEach(l => l.classList.remove('active'));
      document.querySelector('[data-section="tareas"]').classList.add('active');
    });
  }
}


/* ==========================================================================
   SECCIÓN 4: FUNCIONALIDAD DEL ESTUDIANTE
   Maneja la realización de tareas y visualización de notas.
   ========================================================================== */

// Dashboard de estudiante - Iniciar tarea
startTaskBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    studentTasksList.classList.add('hidden');
    studentTaskView.classList.remove('hidden');
  });
});

// Volver a lista de tareas
backToTasksBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    studentTaskView.classList.add('hidden');
    resultsView.classList.add('hidden');
    studentTasksList.classList.remove('hidden');
  });
});

// Terminar tarea (Botón finalizar evaluación)
if (finishTaskBtn) {
  finishTaskBtn.addEventListener('click', () => {
    // Verificar que todas las preguntas estén respondidas
    const questions = document.querySelectorAll('.question-item');
    let allAnswered = true;
    
    questions.forEach(question => {
      const radios = question.querySelectorAll('input[type="radio"]:checked');
      if (radios.length === 0) {
        allAnswered = false;
      }
    });
    
    if (!allAnswered) {
      alert('Por favor responde todas las preguntas antes de terminar');
      return;
    }
    
    // Mostrar pantalla de carga
    studentTaskView.classList.add('hidden');
    loadingView.classList.remove('hidden');
    
    // Simular tiempo de procesamiento
    setTimeout(() => {
      loadingView.classList.add('hidden');
      resultsView.classList.remove('hidden');
    }, 2000);
  });
}

// Ver resultados
viewResultsBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    studentTasksList.classList.add('hidden');
    resultsView.classList.remove('hidden');
  });
});


/* ==========================================================================
   SECCIÓN 5: UTILIDADES, ARCHIVOS Y DESCARGAS
   Lógica auxiliar para subir archivos, eliminar elementos y generar reportes.
   ========================================================================== */

// Botones de eliminar archivos
document.querySelectorAll('.table-responsive button.btn-outline-danger').forEach(btn => {
  btn.addEventListener('click', function() {
    if (confirm('¿Estás seguro de que deseas eliminar este archivo?')) {
      const row = this.closest('tr');
      row.remove();
    }
  });
});

// Botón de subir archivo (Simulación)
if (document.getElementById('upload-file-btn')) {
  document.getElementById('upload-file-btn').addEventListener('click', function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx';
    input.onchange = function() {
      if (this.files[0].size > 25 * 1024 * 1024) {
        alert('El archivo es demasiado grande. El tamaño máximo es 25MB.');
        return;
      }
      
      const fileName = this.files[0].name;
      const fileSize = Math.round(this.files[0].size / 1024) + ' KB';
      const date = new Date().toLocaleDateString('es-ES');
      
      const fileTable = document.querySelector('.table-responsive tbody');
      const newRow = document.createElement('tr');
      
      // Determinar el icono según la extensión
      let iconClass = 'far fa-file me-2 text-secondary';
      if (fileName.endsWith('.pdf')) iconClass = 'far fa-file-pdf me-2 text-danger';
      if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) iconClass = 'far fa-file-word me-2 text-primary';
      if (fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) iconClass = 'far fa-file-powerpoint me-2 text-warning';
      if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) iconClass = 'far fa-file-excel me-2 text-success';
      
      newRow.innerHTML = `
        <td><i class="${iconClass}"></i>${fileName}</td>
        <td>${fileSize}</td>
        <td>${date}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-1"><i class="fas fa-download"></i></button>
          <button class="btn btn-sm btn-outline-danger"><i class="fas fa-trash"></i></button>
        </td>
      `;
      
      fileTable.appendChild(newRow);
      
      // Añadir event listener al nuevo botón de eliminar
      const deleteBtn = newRow.querySelector('.btn-outline-danger');
      deleteBtn.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que deseas eliminar este archivo?')) {
          newRow.remove();
        }
      });
    };
    input.click();
  });
}

// Habilitar botones de Editar y Eliminar en Tareas Existentes
document.querySelectorAll('#tareas-section .task-card button.btn-outline-danger').forEach(btn => {
  btn.addEventListener('click', function() {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      const card = this.closest('.col-md-6');
      card.remove();
    }
  });
});

document.querySelectorAll('#tareas-section .task-card button.btn-outline-primary').forEach(btn => {
  btn.addEventListener('click', function() {
    // Obtener datos de la tarea para edición
    const card = this.closest('.task-card');
    const taskTitle = card.querySelector('h3').textContent;
    const taskDueDate = card.querySelector('.text-muted').textContent.replace('Fecha de entrega: ', '');
    const taskDescription = card.querySelector('p:not(.text-muted)').textContent;
    
    // Redirigir a la sección de edición (reutilizando la sección de crear tarea)
    dashboardSections.forEach(section => {
      section.classList.add('hidden');
    });
    document.getElementById('crear-tarea-section').classList.remove('hidden');
    
    // Actualizar enlaces activos
    sidebarLinks.forEach(l => l.classList.remove('active'));
    document.querySelector('[data-section="crear-tarea"]').classList.add('active');
    
    // Prellenar el formulario con los datos de la tarea
    document.getElementById('task-title').value = taskTitle;
    document.getElementById('task-description').value = taskDescription;
    // Convertir fecha de formato DD/MM/YYYY a YYYY-MM-DD para el input date
    const dateParts = taskDueDate.split('/');
    if (dateParts.length === 3) {
      document.getElementById('task-due-date').value = 
        `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
    }
  });
});

// Implementar descarga de informe en formato Word
document.querySelector('#results-view .btn-primary').addEventListener('click', function() {
  // Crear un documento con el contenido del informe
  const percentageScore = document.querySelector('.display-4').textContent;
  const questionsScore = document.querySelector('.text-muted').textContent;
  
  // Obtener las competencias
  const competencies = [];
  document.querySelectorAll('.competency-bar').forEach((bar, index) => {
    const competencyName = bar.previousElementSibling.querySelector('span:first-child').textContent;
    const competencyValue = bar.previousElementSibling.querySelector('span:last-child').textContent;
    competencies.push({ name: competencyName, value: competencyValue });
  });
  
  // Generar contenido para la descarga
  let content = `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #4361ee; text-align: center; }
        .score { font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 20px; }
        .competency { margin-bottom: 10px; }
        .recommendations { margin-top: 30px; }
      </style>
    </head>
    <body>
      <h1>Informe de Evaluación</h1>
      <div class="score">${percentageScore} - ${questionsScore}</div>
      
      <h2>Diagnóstico de Competencias</h2>
  `;
  
  competencies.forEach(comp => {
    content += `<div class="competency"><strong>${comp.name}:</strong> ${comp.value}</div>`;
  });
  
  content += `
      <div class="recommendations">
        <h2>Recomendaciones</h2>
        <p>Basado en tu desempeño, te recomendamos:</p>
        <ul>
          <li>Continuar practicando los ejercicios de resolución de ecuaciones cuadráticas.</li>
          <li>Revisar el material suplementario proporcionado en la plataforma.</li>
          <li>Consultar con tu profesor para aclarar dudas específicas.</li>
        </ul>
      </div>
    </body>
    </html>
  `;
  
  // Crear un Blob con el contenido HTML
  const blob = new Blob([content], {type: 'application/msword'});
  const url = URL.createObjectURL(blob);
  
  // Crear un enlace para descargar el archivo
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Informe_Evaluacion.doc';
  document.body.appendChild(a);
  a.click();
  
  // Limpiar
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// Función auxiliar: Renderizar tareas dinámicamente en el perfil de estudiante
function renderStudentTasks() {
  const tasksTableBody = document.querySelector('#student-tasks-list tbody');
  tasksTableBody.innerHTML = ''; // Limpiar tabla existente
  
  // Obtener tareas del profesor (simulación)
  const profesorTasks = document.querySelectorAll('#tareas-section .task-card');
  
  // Crear una entrada en la tabla para cada tarea
  profesorTasks.forEach((task, index) => {
    const title = task.querySelector('h3.h5').textContent;
    const dueDate = task.querySelector('.text-muted').textContent.replace('Fecha de entrega: ', '');
    const status = index === 2 ? 'Completada' : 'Pendiente';
    const statusClass = index === 2 ? 'bg-success' : 'bg-warning text-dark';
    
    const taskRow = document.createElement('tr');
    taskRow.innerHTML = `
      <td>${title}</td>
      <td>${dueDate}</td>
      <td><span class="badge ${statusClass}">${status}</span></td>
      <td>
        ${index === 2 ? 
          '<button class="btn btn-sm btn-outline-primary view-results" data-task-id="' + (index + 1) + '">Ver Resultados</button>' :
          '<button class="btn btn-sm btn-primary start-task" data-task-id="' + (index + 1) + '">Realizar</button>'}
      </td>
    `;
    
    tasksTableBody.appendChild(taskRow);
  });
  
  // Actualizar event listeners para los nuevos botones
  document.querySelectorAll('.start-task').forEach(btn => {
    btn.addEventListener('click', () => {
      const taskId = btn.dataset.taskId;
      studentTasksList.classList.add('hidden');
      studentTaskView.classList.remove('hidden');
      
      // Actualizar el contenido de la vista de tarea con la tarea seleccionada
      const selectedTask = document.querySelector(`.task-card:nth-child(${taskId})`);
      if (selectedTask) {
        const title = selectedTask.querySelector('h3.h5').textContent;
        const description = selectedTask.querySelector('p:not(.text-muted)').textContent;
        const dueDate = selectedTask.querySelector('.text-muted').textContent.replace('Fecha de entrega: ', '');
        
        document.querySelector('#student-task-view h2').textContent = title;
        document.querySelector('#student-task-view p.mb-4').textContent = description;
        document.querySelector('#student-task-view .text-muted').textContent = `Fecha límite: ${dueDate}`;
      }
    });
  });
  
  document.querySelectorAll('.view-results').forEach(btn => {
    btn.addEventListener('click', () => {
      studentTasksList.classList.add('hidden');
      resultsView.classList.remove('hidden');
    });
  });
}