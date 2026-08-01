import { ExamStatus } from "../../../common-js/models/examStatus.js";

// Read from storage

const users = JSON.parse(localStorage.getItem("users")) || [];

const currentCred = JSON.parse(sessionStorage.getItem("auth"));

const currentUser = users.find(user => user.nationalId === currentCred.userId);

// examAttempts

// welcome user by his name 

document.querySelector(".student_name").textContent = currentUser.fullName ?? "user";




// Tabs & Tables switch

const tabs = document.querySelector(".tabs");

const firstTable = document.querySelector(".available-table");
const secondTable = document.querySelector(".history-table");

let activeTab = 0; //  0 firstTable  1 secondTable

tabs.addEventListener("click",function(event) {
    const target = event.target;

    if (target.classList.contains('inactive-tab')) {
        target.classList.replace('inactive-tab', 'active-tab');

        activeTab = (activeTab + 1) % 2;
        let nextTab;

        if (activeTab === 0 ) nextTab = target.nextElementSibling;
        
        else nextTab = target.previousElementSibling;

        nextTab.classList.replace('active-tab','inactive-tab');

        firstTable.classList.toggle('inactive-table');
        secondTable.classList.toggle('inactive-table');

        searchInput.value = "";
        const event = new Event('input');
        searchInput.dispatchEvent(event);
    } 
});


// search

const searchInput = document.querySelector(".searchbox > input");



searchInput.addEventListener("input",function() {
    const exams = JSON.parse(localStorage.getItem("exams")) || [];
    const examAttempts = JSON.parse(localStorage.getItem("examAttempts")) || {};

    const attempts = examAttempts.filter(attempt => attempt.userId === currentUser.nationalId);
    

     if (activeTab === 0) {
        const tbody = firstTable.querySelector("tbody");
        tbody.textContent = "";
        

        const value = searchInput.value.toLowerCase().trim();
        exams.forEach(exam => {
            if (exam.title.toLowerCase().trim().startsWith(value) && attempts?.find(attempt => attempt?.examId === exam.examId) === undefined && exam.status != ExamStatus.INACTIVE) {
                    let totalGrade = 0;
                    exam.questions.forEach(question => totalGrade += question.mark);
                    addDataToTable(tbody,[exam.title,exam.questions.length,totalGrade,exam.examId]);
            }
        });
    }
    
    if (activeTab === 1) {
        const tbody = secondTable.querySelector("tbody");
        tbody.textContent = "";

        const value = searchInput.value.toLowerCase();
        attempts?.forEach(attempt => {
            if (attempt.examTitle.toLowerCase().startsWith(value)) {
                    let totalGrade = 0;
                    attempt.questions.forEach(question => totalGrade += question.mark);
                    addDataToTable(tbody,
                        [attempt.examTitle,attempt.questions.length,totalGrade,
                            attempt.grade,
                            attempt?.success?"Success":"Fail",
                            attempt?.attemptId]);
            }
        });
    }
})

triggerSearchInput();


function addDataToTable(element,dataArr) {

    if (activeTab == 0) {
        element.innerHTML +=
                `<tr>
                        <td class="title-data">${dataArr[0]}</td>
                        <td>${dataArr[1]}</td>
                        <td>${dataArr[2]}</td>
                        <td>
                            <button class="attempt_btn btn" onclick="redirectToAttemptExamPage('${dataArr[3]}')" >
                                <i class="fa-solid fa-chevron-right"></i> Attempt
                            </button>
                        </td>
                    </tr>`
    }

    else if (activeTab == 1) { 
        element.innerHTML += 
                `<tr>
                        <td class="title-data">${dataArr[0]??"_"}</td>
                        <td>${dataArr[1]??"_"}</td>
                        <td>${dataArr[2]??"_"}</td>
                        <td>${dataArr[3]??"_"}</td>
                        <td><span class = "result-status ${dataArr[4] ==="Success"?"pass":"fail"}">${dataArr[4]??"_"}</span></td>
                        <td>
                            <button class="review-btn btn" onclick="redirectToReviewExamPage('${dataArr[5]??null}')">
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
                    </tr>`
    }
}

window.redirectToAttemptExamPage = (examId) => {
    window.location.href = `./attempt-exam/attempt-exam.html?examId=${examId}`;
}

window.redirectToReviewExamPage = (attemptId) => {
    if (attemptId !== null)
         window.location.href = `./exam-review/exam-review.html?attemptId=${attemptId}`;
    else
        console.log("attemptId is null");
}

function triggerSearchInput() {
    searchInput.value = "";
    const event = new Event('input');
    searchInput.dispatchEvent(event);
}