import { ExamStatus } from "/common-js/models/examStatus.js";
import { getUsers, getExams, getAttempts } from "/common-js/storage.js";

// STATE MANAGEMENT 
let activeTab = 0; // 0 = Available Exams, 1 = History

// DOM ELEMENTS 
const elements = {
  studentName: document.querySelector(".student_name"),
  cardsContainer: document.querySelector(".cards-container"),
  tabs: document.querySelector(".tabs"),
  firstTable: document.querySelector(".available-table"),
  secondTable: document.querySelector(".history-table"),
  searchInput: document.querySelector(".searchbox > input"),
};

// CORE DATA INITIALIZATION 
const currentUser = getCurrentUser();
if (!currentUser) console.error("No authenticated user found.");


// redirection 
window.redirectToAttemptExamPage = examId => 
  window.location.href = `./attempt-exam/attempt-exam.html?examId=${examId}`;

window.redirectToReviewExamPage = (attemptId) =>
  (attemptId && attemptId !== "null") ? 
    window.location.href = `./exam-review/exam-review.html?attemptId=${attemptId}`
    : 
    console.error("Cannot redirect: attemptId is null or invalid.");

// HELPER FUNCTIONS 

function getCurrentUser() {
    const users = getUsers();
    const currentCred = JSON.parse(sessionStorage.getItem("auth")) || {};
    return users.find((user) => user.nationalId === currentCred.userId) || null;
}

function getUserData() {
  if (!currentUser) return { userAttempts: [], availableExams: [] };

  const attempts = getAttempts();
  const exams = getExams();

  const userAttempts = attempts.filter((attempt) => attempt.userId === currentUser.nationalId);
  
  const userAttemptExamIds = new Set(userAttempts.map((attempt) => attempt.examId));
  const availableExams = exams.filter(
    (exam) => !userAttemptExamIds.has(exam.examId) && exam.status === ExamStatus.ACTIVE
  );

  return { userAttempts, availableExams };
}

function calculateTotalGrade(questions = []) {
  return questions.reduce((sum, q) => sum + (q.mark || 0), 0);
}

// UI RENDER FUNCTIONS 

function renderDashboardHeader() {
  if (elements.studentName)
    elements.studentName.textContent = currentUser?.fullName ?? "User";
  

  const { userAttempts, availableExams } = getUserData();
  const totalPassed = userAttempts.filter((attempt) => attempt.success).length;
  const passRate = userAttempts.length > 0 ? Math.round((totalPassed / userAttempts.length) * 100) : 0;

  if (elements.cardsContainer) {
    elements.cardsContainer.querySelector(".available_exams").textContent = availableExams.length;
    elements.cardsContainer.querySelector(".completed_exams").textContent = userAttempts.length;
    elements.cardsContainer.querySelector(".exams_passed").textContent = totalPassed;
    elements.cardsContainer.querySelector(".pass_rate").textContent = `${passRate}%`;
  }
}

function createAvailableExamRow(exam) {
  const totalGrade = calculateTotalGrade(exam.questions);
  return `
    <tr>
      <td class="title-data">${exam.title ?? "_"}</td>
      <td>${exam.questions?.length ?? 0}</td>
      <td>${totalGrade}</td>
      <td>
        <button class="attempt_btn btn" data-action="attempt" data-id="${exam.examId}">
          <i class="fa-solid fa-chevron-right"></i> Attempt
        </button>
      </td>
    </tr>`;
}

function createHistoryRow(attempt) {
  const totalGrade = calculateTotalGrade(attempt.questions);
  const isSuccess = attempt?.success;
  const statusText = isSuccess ? "Success" : "Fail";
  const statusClass = isSuccess ? "pass" : "fail";

  return `
    <tr>
      <td class="title-data">${attempt.examTitle ?? "_"}</td>
      <td>${attempt.questions?.length ?? 0}</td>
      <td>${attempt.grade ?? "_"} / ${totalGrade}</td>
      <td><span class="result-status ${statusClass}">${statusText}</span></td>
      <td>
        <button class="review-btn btn" data-action="review" data-id="${attempt.attemptId ?? ""}">
          <svg viewBox="0 0 24 24" fill="none">
            <g clip-path="url(#clip0_15_200)">
              <circle cx="12" cy="13" r="2" stroke="currentColor" stroke-linejoin="round"/>
              <path d="M12 7.5C7.69517 7.5 4.47617 11.0833 3.39473 12.4653C3.14595 12.7832 3.14595 13.2168 3.39473 13.5347C4.47617 14.9167 7.69517 18.5 12 18.5C16.3048 18.5 19.5238 14.9167 20.6053 13.5347C20.8541 13.2168 20.8541 12.7832 20.6053 12.4653C19.5238 11.0833 16.3048 7.5 12 7.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
              <clipPath id="clip0_15_200">
                <rect width="24" height="24" fill="white"/>
              </clipPath>
            </defs>
          </svg> Review
        </button>
      </td>
    </tr>`;
}

function renderTableData() {
  const query = elements.searchInput?.value.trim().toLowerCase() || "";
  const { userAttempts } = getUserData();

  if (activeTab === 0) {
    const tbody = elements.firstTable?.querySelector("tbody");
    if (!tbody) return;

    const exams = getExams() || [];
    const userAttemptIds = new Set(userAttempts.map((a) => a.examId));

    const filteredExams = exams.filter(
      (exam) =>
        exam.status !== ExamStatus.INACTIVE &&
        !userAttemptIds.has(exam.examId) &&
        exam.title.toLowerCase().includes(query)
    );

    tbody.innerHTML = filteredExams.map(createAvailableExamRow).join("");
  } else {
    const tbody = elements.secondTable?.querySelector("tbody");
    if (!tbody) return;

    const filteredAttempts = userAttempts.filter((attempt) =>
      attempt.examTitle?.toLowerCase().includes(query)
    );

    tbody.innerHTML = filteredAttempts.map(createHistoryRow).join("");
  }
}

function triggerSearchInput() {
  if (!elements.searchInput) return;
  elements.searchInput.value = "";
  renderTableData();
}

// --- EVENT HANDLERS ---

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
  elements.firstTable.classList.toggle("inactive-table", activeTab !== 0);
  elements.secondTable.classList.toggle("inactive-table", activeTab !== 1);

  triggerSearchInput();
}

function handleTableClick(event) {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;

  if (action === "attempt") {
    window.redirectToAttemptExamPage(id);
  } else if (action === "review") {
    window.redirectToReviewExamPage(id);
  }
}

// INITIALIZATION

function init() {
  renderDashboardHeader();

  // Event Listeners
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