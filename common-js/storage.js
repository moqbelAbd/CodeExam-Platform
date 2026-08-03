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
        { questionId: "q_001", text: "What is 2+2?", type: QuestionType.SHORT, options: [""], rightAnswer: ["4"], mark: 10 },
        // MCQ
        { questionId: "q_002", text: "Select your language?", type: QuestionType.MCQ, options: ["JS", "Python", "Java"], rightAnswer: ["JS"], mark: 10 },
        { questionId: "q_003", text: "Which is a framework?", type: QuestionType.MCQ, options: ["React", "CSS", "HTML"], rightAnswer: ["React"], mark: 10 },
        // True/False
        { questionId: "q_004", text: "Is JS a language?", type: QuestionType.TRUE_FALSE, options: ["True", "False"], rightAnswer: ["True"], mark: 10 },
        // Multiple Answer 
        { questionId: "q_005", text: "Which of the following are backend technologies?", type: QuestionType.MULTIPLE, options: ["Spring Boot", "React", "PostgreSQL", "Tailwind CSS"], rightAnswer: ["Spring Boot", "PostgreSQL"], mark: 10 },
    ];

    const mock2Questions = [
        // Short Answer
        { questionId: "q_006", text: "What is 5*5?", type: QuestionType.SHORT, options: [""], rightAnswer: ["25"], mark: 10 },
        // MCQ
        { questionId: "q_007", text: "Which is a framework?", type: QuestionType.MCQ, options: ["React", "CSS", "HTML"], rightAnswer: ["React"], mark: 10 },
        // True/False
        { questionId: "q_008", text: "Is JS a language?", type: QuestionType.TRUE_FALSE, options: ["True", "False"], rightAnswer: ["True"], mark: 10 },
        { questionId: "q_009", text: "Is HTML a language?", type: QuestionType.TRUE_FALSE, options: ["True", "False"], rightAnswer: ["False"], mark: 10 },
        // Multiple Answer 
        { questionId: "q_010", text: "Which of these are programming languages?", type: QuestionType.MULTIPLE, options: ["Java", "HTML", "C#", "CSS"], rightAnswer: ["Java", "C#"], mark: 10 }
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
        questionId: "q_006",
        questionText: "What does HTML stand for?",
        type: "MCQ", 
        studentAnswer: "Hyper Text Markup Language",
        correctAnswer: "Hyper Text Markup Language",
        isCorrect: true,
        points: 5
    },
    {
        questionId: "q_007",
        questionText: "JavaScript is strongly typed.",
        type: "TRUE_FALSE",
        studentAnswer: "True",
        correctAnswer: "False",
        isCorrect: false,
        points: 0
    }
];

// 2. Build the attempt object exactly as your system expects it
const mockAttempt = {
    attemptId: `ATT-${Date.now()}-mock`, 
    userId: "student123",           
    examId: "exam_02",                  
    examTitle: "Web Development Basics",
    studentAnswers: mockStudentAnswers,
    questions: mockStudentAnswers,       
    grade: 5,                            
    success: false,                      
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
            questions: shuffleArray(mockQuestions),
            examAttempts: []
        };

        const inactiveExam = {
            examId: "exam_02",
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

