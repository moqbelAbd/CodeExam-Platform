import { QuestionType } from "./models/questionType.js";
import {UserRole} from "./models/userRole.js";
import {ExamStatus} from "./models/examStatus.js";

const USERS_KEY = 'users';
const EXAMS_KEY = 'exams';
const EXAMS_ATTEMPTS_KEY = 'examAttempts';
const QUESTIONS_KEY = 'questions';


export function initializeStorage() {

    const mockQuestions = [
        // Short Answer
        { questionId: "1", text: "What is 2+2?", type: QuestionType.SHORT, options: [""], rightAnswer: ["4"], mark: 10 },
        { questionId: "2", text: "What is 5*5?", type: QuestionType.SHORT, options: [""], rightAnswer: ["25"], mark: 10 },
        // MCQ
        { questionId: "3", text: "Select your language?", type: QuestionType.MCQ, options: ["JS", "Python", "Java"], rightAnswer: ["JS"], mark: 10 },
        { questionId: "4", text: "Which is a framework?", type: QuestionType.MCQ, options: ["React", "CSS", "HTML"], rightAnswer: ["React"], mark: 10 },
        // True/False
        { questionId: "5", text: "Is JS a language?", type: QuestionType.TF, options: ["True", "False"], rightAnswer: ["True"], mark: 10 },
        { questionId: "6", text: "Is HTML a language?", type: QuestionType.TF, options: ["True", "False"], rightAnswer: ["False"], mark: 10 },
        // Multiple Answer 
        { questionId: "7", text: "Which of the following are backend technologies?", type: QuestionType.MULTIPLE, options: ["Spring Boot", "React", "PostgreSQL", "Tailwind CSS"], rightAnswer: ["Spring Boot", "PostgreSQL"], mark: 10 },
        { questionId: "8", text: "Which of these are programming languages?", type: QuestionType.MULTIPLE, options: ["Java", "HTML", "C#", "CSS"], rightAnswer: ["Java", "C#"], mark: 10 }
    ];

    if (!localStorage.getItem(QUESTIONS_KEY)) {
        localStorage.setItem(QUESTIONS_KEY, JSON.stringify(mockQuestions));
    }

    if (!localStorage.getItem(USERS_KEY)) {
        const teacherUsers = [
            {
                nationalId: "123456789",
                fullName: "T.John Smith",
                PhoneNumber: "0770000000",
                username: "teacher123",
                password: "123",
                role: UserRole.Teacher
            }
        ];

        const studentUsers = [
            {
                nationalId: "123456789",
                fullName: "John Doe",
                PhoneNumber: "0790000000",
                username: "student123", 
                password: "123",
                role: UserRole.Student
            }
        ];
        
        localStorage.setItem(USERS_KEY, JSON.stringify([...teacherUsers, ...studentUsers]));
    }

    const mockAttempt = {
        attemptId: "1",
        examId: "2", 
        studentUsername: "student123",
        score: 40,
        totalMarks: 50,
        submittedAt: new Date().toISOString()
    };

    if (!localStorage.getItem(EXAMS_KEY)) {
        const activeExam = {
            examId: "1",
            title: "Generated exam ",
            status: ExamStatus.ACTIVE,
            questions: shuffleArray(mockQuestions),
            examAttempts: []
        };

        const inactiveExam = {
            examId: "2",
            title: "New exam ",
            status: ExamStatus.INACTIVE,
            questions: shuffleArray(mockQuestions),
            examAttempts: [mockAttempt] 
        };

        localStorage.setItem(EXAMS_KEY, JSON.stringify([activeExam, inactiveExam]));
    }

    if (!localStorage.getItem(EXAMS_ATTEMPTS_KEY)) {
        localStorage.setItem(EXAMS_ATTEMPTS_KEY, JSON.stringify([mockAttempt]));
    }
}

function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    const newArray = [...array]; // Create a copy to avoid mutating the original
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
    }
    return newArray;
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

