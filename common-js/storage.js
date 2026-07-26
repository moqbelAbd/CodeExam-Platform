import { QuestionType } from "./models/questionType.js";

const USERS_KEY = 'users';
const EXAMS_KEY = 'exams';
const EXAMS_ATTEMPTS_KEY = 'examAttempts';
const QUESTIONS_KEY = 'questions';

/**
 * Initializes localStorage with empty arrays if they don't exist.
 * Injects a default teacher account for initial access.
 */
export function initializeStorage() {

            const firstQuestion = 
            {
                questionId: "1",
                text: "first question?",
                type: QuestionType.SHORT,
                options: [""],
                rightAnswer: ["yes"],
                mark: 10,
                }

    if (!localStorage.getItem(USERS_KEY)) {
        const defaultUsers = [
            {
                nationalId: "123456789",
                fullName: "System Admin",
                PhoneNumber: "0700000000",
                username: "teacher123",
                password: "123",
                role: "Teacher"
            }
        ];
        localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    }

    if (!localStorage.getItem(QUESTIONS_KEY)) {


        
        localStorage.setItem(QUESTIONS_KEY, JSON.stringify(firstQuestion));
    }

    if (!localStorage.getItem(EXAMS_KEY)) {
        const firstExam=[
                            {
                            examId:"1",
                            title:"new exam",
                            status:"active",

                            questions:[firstQuestion],

                            examAttempts:[]
                            }
                            ]

        localStorage.setItem(EXAMS_KEY, JSON.stringify([]));
    }
}



// --- Users Storage Methods ---

export function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

export function getStudents() {
    let users= JSON.parse(localStorage.getItem(USERS_KEY)) || []
    let students=[]

    users.forEach (user => {
        if (user.role != "Teacher")
            students.push(user)
    })
    return students;
}

export function saveStudent(student) {
    localStorage.setItem(USERS_KEY, JSON.stringify(student));
}

// --- Exams Storage Methods ---

export function getExams() {
    return JSON.parse(localStorage.getItem(EXAMS_KEY)) || [];
}

export function getActiveExams() {
    let exams= JSON.parse(localStorage.getItem(EXAMS_KEY)) || [];

    let activeExams=[]
    exams.array.forEach(exam => {
        if (exam.status=="active")
            activeExams.push(exam)
    });

    return activeExams
}

export function saveExam(exam) {
    localStorage.setItem(EXAMS_KEY, JSON.stringify(exam));
}

// --- Attempts Storage Methods ---
export function getAttempts() {
    return JSON.parse(localStorage.getItem(EXAMS_ATTEMPTS_KEY)) || [];
}

