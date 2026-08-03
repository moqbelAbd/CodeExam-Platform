import { getUsers } from "../../common-js/storage.js";
import { UserRole } from "../../common-js/models/userRole.js";
import { isTeacher } from "../../common-js/auth.js";

const AUTH_KEY = 'auth';

const pages = {
    home: "/pages/homepage/homepage.html",

        teacherDashboard: "/pages/dashboard/teacher-dashboard/teacher-dashboard.html",
        studentDashboard: "/pages/dashboard/student-dashboard/student-dashboard.html"
    };
    

let signInBtn=document.getElementById("sign-in-btn")
let usernameInput=document.getElementById("username-input")
let passwordInput=document.getElementById("password-input")

signInBtn.addEventListener("click", (e) => {
    //  PREVENT the <form> from refreshing the page
    e.preventDefault();

    const currentUsername = usernameInput.value;
    const currentPassword = passwordInput.value;

    login(currentUsername, currentPassword);
});

export function login(username, password) {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    const errorBanner = document.getElementById("login-error-message"); 

    if (user) {
        const sessionData = {
            isSignedIn: true,
            userId: user.nationalId,
            userRole: user.role
        };
        
        sessionStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));

                if(user.role === UserRole.TEACHER){
            console.log("Welcome Teacher");
        } else {
            console.log("Welcome Student");
        }
        
    if(user.role === UserRole.TEACHER){
            console.log("Welcome Teacher");
            window.location.href = pages.teacherDashboard; 
        } else {
            console.log("Welcome Student");
            window.location.href = pages.studentDashboard; 
        }
        return true;

        
    }
    
  else {
    if (usernameInput.value != "" && passwordInput.value != "") {
        console.log("Invalid username or password");
        const toastElement = document.getElementById("errorToast");
        const toast = new bootstrap.Toast(toastElement);
        toast.show();   
        }
    }
}

// export function logout() {
//     sessionStorage.removeItem(AUTH_KEY);
//      window.location.href = pages.home; 
// }



