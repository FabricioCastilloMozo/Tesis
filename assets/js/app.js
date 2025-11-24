// Add this error handler at the beginning of the script section
// Global error handler to catch and log errors properly
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Error: ' + message + ' at ' + source + ':' + lineno + ':' + colno, error);
  return true; // Prevent default handling
};

// Variables globales
let selectedRole = null;

// Elementos del DOM
const roleSelection = document.getElementById('role-selection');
const loginSection = document.getElementById('login-section');
const loginRoleText = document.getElementById('login-role-text');
const loginForm = document.getElementById('login-form');
const backToRoleBtn = document.getElementById('back-to-role');
const profesorDashboard = document.getElementById('profesor-dashboard');
const estudianteDashboard = document.getElementById('estudiante-dashboard');
const roleCards = document.querySelectorAll('.role-card');

// Elementos del dashboard de profesor
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const dashboardSections = document.querySelectorAll('.dashboard-section');
const addQuestionBtn = document.getElementById('add-question-btn');
const questionsContainer = document.getElementById('questions-container');
const createTaskForm = document.getElementById('create-task-form');

// Elementos del dashboard de estudiante
const studentTasksList = document.getElementById('student-tasks-list');
const studentTaskView = document.getElementById('student-task-view');
const loadingView = document.getElementById('loading-view');
const resultsView = document.getElementById('results-view');
const startTaskBtns = document.querySelectorAll('.start-task');
const backToTasksBtns = document.querySelectorAll('.back-to-tasks');
const finishTaskBtn = document.getElementById('finish-task-btn');
const viewResultsBtns = document.querySelectorAll('.view-results');

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

// Login
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

// Dashboard de profesor - Navegación
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

// Agregar pregunta
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
  });
}