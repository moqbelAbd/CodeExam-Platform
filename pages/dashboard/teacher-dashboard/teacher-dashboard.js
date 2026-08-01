import { UserRole } from "../../../common-js/models/userRole.js";

// --- DOM Elements ---
const tabs = document.querySelector(".tabs");
const examsTable = document.querySelector(".exams-table");
const studentsTable = document.querySelector(".students-table");
const btnAddExam = document.getElementById("add-exam-btn");
const btnAddStudent = document.getElementById("add-student-btn");
const searchInput = document.querySelector(".searchbox > input");
const addStudentContainer = document.getElementById("add-student-container");

let users = JSON.parse(localStorage.getItem("users")) || [];
let exams = JSON.parse(localStorage.getItem("exams")) || [];

let activeTab = 0; // 0: exams, 1: students




document.querySelector(".total_students").textContent = users.filter(user=>user.role.toLowerCase() === "student").length ?? "_";
document.querySelector(".active_exams").textContent = exams.filter(exam=>exam.status.toLowerCase() === "active").length ?? "_";


// Reload search
const triggerSearch = () => searchInput.dispatchEvent(new Event("input"));


// Tab Switching
tabs.addEventListener("click", ({ target }) => {
    if (!target.classList.contains("inactive-tab")) return;

    // Toggle Tab classes
    document.querySelector(".active-tab").classList.replace("active-tab", "inactive-tab");
    target.classList.replace("inactive-tab", "active-tab");

    activeTab = activeTab === 0 ? 1 : 0;

    // Toggle Views & Buttons
    const isExams = activeTab === 0;
    btnAddExam.style.display = isExams ? "flex" : "none";
    btnAddStudent.style.display = isExams ? "none" : "flex";
    examsTable.classList.toggle("inactive-table", !isExams);
    studentsTable.classList.toggle("inactive-table", isExams);

    searchInput.value = "";
    triggerSearch();
});

// --- Redirects & Visibility ---
btnAddExam.addEventListener("click", () => window.location.href = "add-exam/add-exam.html");
btnAddStudent.addEventListener("click", () => addStudentContainer.style.display = "block");
document.getElementById("add-student-cancel").addEventListener("click", () => addStudentContainer.style.display = "none");

// --- Render Templates ---
const getExamRow = (exam) => `
    <tr>
        <td class="title-data">${exam.title}</td>
        <td>${exam.questions.length}</td>
        <td>${exam.questions.reduce((sum, question) => sum + question.mark, 0)}</td>
        <td><span class="exam-status ${exam.status.toLowerCase()}">${exam.status.toLowerCase()}</span></td>
        <td>
            <button class="exam-set_status btn" style="background-color:var(--card-background); color:var(--text-primary);"  onclick="toggleExamStatus('${exam.title}')">
                ${exam.status === "Active" ? "Set Inactive" : "Set Active"}
            </button>
        </td>
        <td>
            <button class="attempts_btn btn" onclick="redirectToAttemptsPage('${exam.title}')">
                <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="13" r="2" stroke="currentColor"/><path d="M12 7.5C7.69517 7.5 4.47617 11.0833 3.39473 12.4653C3.14595 12.7832 3.14595 13.2168 3.39473 13.5347C4.47617 14.9167 7.69517 18.5 12 18.5C16.3048 18.5 19.5238 14.9167 20.6053 13.5347C20.8541 13.2168 20.8541 12.7832 20.6053 12.4653C19.5238 11.0833 16.3048 7.5 12 7.5Z" stroke="currentColor"/></svg>
                <span>Attempts</span>
            </button>
        </td>
    </tr>`;

const getStudentRow = (user) => `
    <tr>
        <td class="title-data">${user.fullName}</td>
        <td>${user.username}</td>
        <td>${user.nationalId}</td>
        <td>
            <button class="delete_btn btn" onclick="deleteStudent('${user.username}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                <span>Delete</span>
            </button>
        </td>
    </tr>`;

// --- Search & Filter Logic ---
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();

    if (activeTab === 0) {
        const exams = JSON.parse(localStorage.getItem("exams")) || [];
        examsTable.querySelector("tbody").innerHTML = exams
            .filter(exam => exam.title.toLowerCase().trim().startsWith(query))
            .map(getExamRow).join("");
    } else {
users = JSON.parse(localStorage.getItem("users")) || [];
studentsTable.querySelector("tbody").innerHTML = users
    .filter(u => 
        // 1. Wrap the OR conditions in their own parentheses
        (u.fullName.toLowerCase().startsWith(query) || u.username.toLowerCase().startsWith(query)) 
        && 
        // 2. Then check the role
        u.role !== UserRole.TEACHER 
    ) 
    .map(getStudentRow)
    .join("");
}
});

// --- Data Mutations ---
window.deleteStudent = (username) => {
    users = users.filter(user => user.username !== username);
    localStorage.setItem("users", JSON.stringify(users));
    triggerSearch();
};

window.redirectToAttemptsPage = (title) => {
    window.location.href = `./exam-attempts/exam-attempts.html?title=${title}`;
}

// Attach to window so the inline onclick can find it
window.toggleExamStatus = (examTitle) => {
    // 1. Find the specific exam in your array
    const examIndex = exams.findIndex(e => e.title === examTitle);
    
    if (examIndex !== -1) {
        // 2. Toggle the status
        const currentStatus = exams[examIndex].status;
        exams[examIndex].status = currentStatus === "Active" ? "Inactive" : "Active";
        
        // 3. Save the updated array back to localStorage
        localStorage.setItem("exams", JSON.stringify(exams));
        
        // 4. Re-calculate and update the dashboard counter
        document.querySelector(".active_exams").textContent = 
            exams.filter(exam => exam.status.toLowerCase() === "active").length || "_";
            
        // 5. Re-render the table to show the changes instantly
        triggerSearch(); 
    }
};

// Initial Load
triggerSearch();


