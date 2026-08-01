import { ExamStatus } from "/common-js/models/examStatus.js";
import { UserRole } from "/common-js/models/userRole.js";
import { getUsers, getExams, getStudents,getAttempts, saveExam, saveStudent } from "/common-js/storage.js";

// STATE MANAGEMENT
let activeTab = 0; // 0 = Exams, 1 = Students

// DOM ELEMENTS
const elements = {
  cardsContainer: document.querySelector(".cards-container"),
  tabs: document.querySelector(".tabs"),
  firstTable: document.querySelector(".exams-table"),
  secondTable: document.querySelector(".students-table"),
  searchInput: document.querySelector(".searchbox > input"),
  btnAddExam: document.getElementById("add-exam-btn"),
  btnAddStudent: document.getElementById("add-student-btn"),
  addStudentContainer: document.getElementById("add-student-container"),
  addStudentCancelBtn: document.getElementById("add-student-cancel"),
};

// CORE DATA INITIALIZATION
let users = getUsers();
let exams = getExams();
let students = getStudents();
let attempts = getAttempts();

// REDIRECTION FUNCTIONS
window.redirectToAddExamPage = () =>
  window.location.href = "add-exam/add-exam.html";


window.redirectToAttemptsPage = title =>
  title ?
    window.location.href = `./exam-attempts/exam-attempts.html?title=${encodeURIComponent(title)}`
  :
    console.error("Cannot redirect: exam title is missing.");

// HELPER FUNCTIONS

function calculateTotalGrade(questions = []) {
  return questions.reduce((sum, q) => sum + (q.mark || 0), 0);
}

function toggleExamStatus(examTitle) {
  const examIndex = exams.findIndex((e) => e.title === examTitle);
  if (examIndex === -1) return;

  const currentStatus = exams[examIndex].status;

  const isActive = String(currentStatus).toLowerCase() === ExamStatus.ACTIVE.toLowerCase();
  
  exams[examIndex].status = isCurrentlyActive ? ExamStatus.INACTIVE : ExamStatus.ACTIVE;
  
  saveExam ? saveExam(exams) : localStorage.setItem("exams", JSON.stringify(exams));

  // Refresh UI
  renderDashboardHeader();
  triggerSearchInput();
}

function deleteStudent(username) {
  users = users.filter((user) => user.username !== username);
  saveStudent ? saveStudent(users) : localStorage.setItem("users", JSON.stringify(users));
  
  students = getStudents() || users.filter((u) => u.role !== UserRole.TEACHER);

  // Refresh UI
  renderDashboardHeader();
  triggerSearchInput();
}

// UI RENDER FUNCTIONS

function renderDashboardHeader() {
  if (!elements.cardsContainer) return;

  const activeExamsCount = exams.filter(
    (exam) => String(exam.status).toLowerCase() === ExamStatus.ACTIVE.toLowerCase()
  ).length;

  const totalPassed = attempts.reduce((sum, attempt) => (attempt.success ? sum + 1 : sum), 0);
  const passRate = attempts.length > 0 ? Math.round((totalPassed / attempts.length) * 100) : 0;

  elements.cardsContainer.querySelector(".total_students").textContent = students.length;
  elements.cardsContainer.querySelector(".active_exams").textContent = activeExamsCount;
  elements.cardsContainer.querySelector(".total_attempts").textContent = attempts.length;
  elements.cardsContainer.querySelector(".pass_rate").textContent = `${passRate}%`;
}

function createExamRow(exam) {
  const totalGrade = calculateTotalGrade(exam.questions);
  const rawStatus = String(exam.status).toLowerCase();
  const isActive = rawStatus === ExamStatus.ACTIVE.toLowerCase();
  const buttonLabel = isActive ? "Set Inactive" : "Set Active";

  return `
    <tr>
      <td class="title-data">${exam.title ?? "_"}</td>
      <td>${exam.questions?.length ?? 0}</td>
      <td>${totalGrade}</td>
      <td><span class="exam-status ${rawStatus}">${rawStatus}</span></td>
      <td>
        <button class="exam-set_status btn secondary-btn" 
                data-action="toggle-status" 
                data-id="${exam.title}">
          ${buttonLabel}
        </button>
      </td>
      <td>
        <button class="attempts_btn btn" data-action="view-attempts" data-id="${exam.title}">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="13" r="2" stroke="currentColor"/>
            <path d="M12 7.5C7.69517 7.5 4.47617 11.0833 3.39473 12.4653C3.14595 12.7832 3.14595 13.2168 3.39473 13.5347C4.47617 14.9167 7.69517 18.5 12 18.5C16.3048 18.5 19.5238 14.9167 20.6053 13.5347C20.8541 13.2168 20.8541 12.7832 20.6053 12.4653C19.5238 11.0833 16.3048 7.5 12 7.5Z" stroke="currentColor"/>
          </svg>
          <span>Attempts</span>
        </button>
      </td>
    </tr>`;
}

function createStudentRow(user) {
  return `
    <tr>
      <td class="title-data">${user.fullName ?? "_"}</td>
      <td>${user.username ?? "_"}</td>
      <td>${user.nationalId ?? "_"}</td>
      <td>
        <button class="delete_btn btn" data-action="delete" data-id="${user.username}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            <line x1="10" x2="10" y1="11" y2="17"/>
            <line x1="14" x2="14" y1="11" y2="17"/>
          </svg>
          <span>Delete</span>
        </button>
      </td>
    </tr>`;
}

function renderTableData() {
  const query = elements.searchInput?.value.trim().toLowerCase() || "";

  if (activeTab === 0) {
    const tbody = elements.firstTable?.querySelector("tbody");
    if (!tbody) return;

    const filteredExams = exams.filter((exam) =>
      exam.title?.toLowerCase().includes(query)
    );

    tbody.innerHTML = filteredExams.map(createExamRow).join("");
  } else {
    const tbody = elements.secondTable?.querySelector("tbody");
    if (!tbody) return;

    const filteredStudents = users.filter(
      (u) =>
        u.role !== UserRole.TEACHER &&
        (u.fullName?.toLowerCase().includes(query) ||
          u.username?.toLowerCase().includes(query))
    );

    tbody.innerHTML = filteredStudents.map(createStudentRow).join("");
  }
}

function triggerSearchInput() {
  if (!elements.searchInput) return;
  elements.searchInput.value = "";
  renderTableData();
}

// EVENT HANDLERS

function handleTabSwitch(event) {
  const target = event.target;
  if (!target.classList.contains("inactive-tab")) return;

  // Toggle active styling
  const activeSibling = target.parentElement.querySelector(".active-tab");
  if (activeSibling) {
    activeSibling.classList.replace("active-tab", "inactive-tab");
  }
  target.classList.replace("inactive-tab", "active-tab");

  // Update state and view
  activeTab = activeTab === 0 ? 1 : 0;
  const isExams = activeTab === 0;

  if (elements.btnAddExam) elements.btnAddExam.style.display = isExams ? "flex" : "none";
  if (elements.btnAddStudent) elements.btnAddStudent.style.display = isExams ? "none" : "flex";

  elements.firstTable?.classList.toggle("inactive-table", !isExams);
  elements.secondTable?.classList.toggle("inactive-table", isExams);

  triggerSearchInput();
}

function handleTableClick(event) {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id; // examTitle or username

  if (action === "toggle-status") {
    toggleExamStatus(id);
  } else if (action === "view-attempts") {
    window.redirectToAttemptsPage(id);
  } else if (action === "delete") {
    deleteStudent(id);
  }
}

// INITIALIZATION

function init() {
  renderDashboardHeader();

  // Navigation & Modal Event Listeners
  elements.btnAddExam?.addEventListener("click", window.redirectToAddExamPage);
  elements.btnAddStudent?.addEventListener("click", () => {
    if (elements.addStudentContainer) elements.addStudentContainer.style.display = "block";
  });
  elements.addStudentCancelBtn?.addEventListener("click", () => {
    if (elements.addStudentContainer) elements.addStudentContainer.style.display = "none";
  });

  // Tab & Search Event Listeners
  elements.tabs?.addEventListener("click", handleTabSwitch);
  elements.searchInput?.addEventListener("input", renderTableData);

  // Event Delegation for Table Action Buttons
  elements.firstTable?.addEventListener("click", handleTableClick);
  elements.secondTable?.addEventListener("click", handleTableClick);

  // Initial table render
  triggerSearchInput();
}

// Run script
init();