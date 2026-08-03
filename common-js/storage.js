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
        { id: "q_001", text: "What is 2+2?", type: QuestionType.SHORT, options: [""], correctAnswer: ["4"], mark: 10 },
        // MCQ
        { id: "q_002", text: "Select your language?", type: QuestionType.MCQ, options: ["JS", "Python", "Java"], correctAnswer: ["JS"], mark: 10 },
        { id: "q_003", text: "Which is a framework?", type: QuestionType.MCQ, options: ["React", "CSS", "HTML"], correctAnswer: ["React"], mark: 10 },
        // True/False (Changed to TRUE_FALSE to match attempt.js)
        { id: "q_004", text: "Is JS a language?", type: QuestionType.TRUE_FALSE, options: ["True", "False"], correctAnswer: ["True"], mark: 10 },
        // Multiple Answer 
        { id: "q_005", text: "Which of the following are backend technologies?", type: QuestionType.MULTIPLE, options: ["Spring Boot", "React", "PostgreSQL", "Tailwind CSS"], correctAnswer: ["Spring Boot", "PostgreSQL"], mark: 10 },
    ];

    const mock2Questions = [
        // Short Answer
        { id: "q_006", text: "What is 5*5?", type: QuestionType.SHORT, options: [""], correctAnswer: ["25"], mark: 10 },
        // MCQ
        { id: "q_007", text: "Which is a framework?", type: QuestionType.MCQ, options: ["React", "CSS", "HTML"], correctAnswer: ["React"], mark: 10 },
        // True/False (Changed to TRUE_FALSE to match attempt.js)
        { id: "q_008", text: "Is JS a language?", type: QuestionType.TRUE_FALSE, options: ["True", "False"], correctAnswer: ["True"], mark: 10 },
        { id: "q_009", text: "Is HTML a language?", type: QuestionType.TRUE_FALSE, options: ["True", "False"], correctAnswer: ["False"], mark: 10 },
        // Multiple Answer 
        { id: "q_010", text: "Which of these are programming languages?", type: QuestionType.MULTIPLE, options: ["Java", "HTML", "C#", "CSS"], correctAnswer: ["Java", "C#"], mark: 10 }
    ];

    if (!localStorage.getItem(QUESTIONS_KEY)) {
        localStorage.setItem(QUESTIONS_KEY, JSON.stringify([...mockQuestions, ...mock2Questions]));
    }

    if (!localStorage.getItem(USERS_KEY)) {
        const teacherUsers = [
            {
                nationalId: "123456789",
                fullName: "T.John Smith",
                PhoneNumber: "0770000000",
                username: "teacher123",
                password: "123",
                role: UserRole.TEACHER
            }
        ];

        const studentUsers = [
            {
                nationalId: "123456789",
                fullName: "John Doe",
                PhoneNumber: "0790000000",
                username: "student123", 
                password: "123",
                role: UserRole.STUDENT
            }
        ];
        
        localStorage.setItem(USERS_KEY, JSON.stringify([...teacherUsers, ...studentUsers]));
    }

// 1. Generate the mock answers that match your question types
const mockStudentAnswers = [
        {
            questionId: "q_006", // Maps to id in mock2Questions
            number: 1,
            text: "What is 5*5?",
            mark: 10,
            scored: 10,
            answer: "25",
            yourAnswer: "25", 
            correctAnswer: ["25"],
            isCorrect: true
        },
        {
            questionId: "q_007", 
            number: 2,
            text: "Which is a framework?",
            mark: 10,
            scored: 10,
            answer: "React",
            yourAnswer: "React", 
            correctAnswer: ["React"],
            isCorrect: true
        },
        {
            questionId: "q_008", 
            number: 3,
            text: "Is JS a language?",
            mark: 10,
            scored: 10,
            answer: "True",
            yourAnswer: "True", 
            correctAnswer: ["True"],
            isCorrect: true
        },
        {
            questionId: "q_009", 
            number: 4,
            text: "Is HTML a language?",
            mark: 10,
            scored: 0, // Intentionally wrong answer for mock data
            answer: "True",
            yourAnswer: "True", 
            correctAnswer: ["False"],
            isCorrect: false
        },
        {
            questionId: "q_010", 
            number: 5,
            text: "Which of these are programming languages?",
            mark: 10,
            scored: 10, 
            answer: "Java, C#",
            yourAnswer: "Java, C#", 
            correctAnswer: ["Java", "C#"],
            isCorrect: true
        }
    ];

// 2. Build the attempt object exactly as your system expects it
const mockAttempt = {
        attemptId: `ATT-${Date.now()}-mock`, 
        userId: "123456789",          
        examId: "exam_02",                  
        examTitle: "New exam",
        studentAnswers: mockStudentAnswers,
        questions: mockStudentAnswers,       
        grade: 40, // Scored 40 out of 50 total points                            
        success: true, // 40/50 is >= 50% threshold                   
        attemptTimestamp: new Date().toLocaleString()
    };

// 3. Save to localStorage (handling existing data)
const existingAttempts = JSON.parse(localStorage.getItem(EXAMS_ATTEMPTS_KEY)) || [];
existingAttempts.push(mockAttempt);
localStorage.setItem(EXAMS_ATTEMPTS_KEY, JSON.stringify(existingAttempts));

    if (!localStorage.getItem(EXAMS_KEY)) {
        const activeExam = {
            examId: "exam_01",
            title: "Generated exam ",
            status: ExamStatus.ACTIVE,
            questions: shuffleArray([...mockQuestions]),
            examAttempts: []
        };

        const inactiveExam = {
            examId: "exam_02",
            title: "New exam",
            status: ExamStatus.INACTIVE,
            questions: shuffleArray([...mock2Questions]), 
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

