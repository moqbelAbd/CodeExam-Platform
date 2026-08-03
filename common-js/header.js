import { UserRole } from "./models/userRole.js";
// import { isTeacher } from "./auth.js";

export function loadHeader() {

    const auth = JSON.parse(sessionStorage.getItem("auth"));
    const isSignedIn = auth?.isSignedIn || false;
    const role = auth?.userRole || "";

    const path = window.location.pathname;

        const pages = {
        home: "/pages/homepage/homepage.html",
        login: "/pages/signIn/signIn.html",
        teacherDashboard: "/pages/dashboard/teacher-dashboard/teacher-dashboard.html",
        studentDashboard: "/pages/dashboard/student-dashboard/student-dashboard.html"
    };

    // Prevent unauthenticated users from accessing any dashboard
    if (path.includes("/pages/dashboard/") && !isSignedIn) {
        window.location.href = pages.login;
        return; // Stop execution
    }

    // Prevent students from accessing the teacher dashboard
    if (path.includes("teacher-dashboard") && role !== UserRole.TEACHER) {
        window.location.href = pages.studentDashboard;
        return;
    }

    // Prevent teachers from accessing the student dashboard (optional, but recommended)
    if (path.includes("student-dashboard") && role === UserRole.TEACHER) {
        window.location.href = pages.teacherDashboard;
        return;
    }
    
        const header = document.getElementById("page-header");
        if (!header) return;

    let basePath = "";
    
    if (path.includes("/pages/dashboard/teacher-dashboard/add-exam/")) {
        basePath = "../../../../";
    } else if (path.includes("/pages/dashboard/teacher-dashboard/")) {
        basePath = "../../../";
    } else if (path.includes("/pages/dashboard/student-dashboard/")) {
        basePath = "../../../";
    }  else if (path.includes("/pages/dashboard/")) {
        basePath = "../../";
    } else if (path.includes("/pages/")) {
        basePath = "../";
    } else {
        basePath = "./";
    }


    let dashboardLink = "";
    let profileLink = "";
    let authButton = "";

    if (isSignedIn) {
        
        if(role == UserRole.TEACHER) {
            dashboardLink = `<li class="nav-item w-100 w-lg-auto"><a class="nav-link" href="${pages.teacherDashboard}">Dashboard</a></li>`;
        } else {
            dashboardLink = `<li class="nav-item w-100 w-lg-auto"><a class="nav-link" href="${pages.studentDashboard}">Dashboard</a></li>`;
        }

        // Added the <li> wrapper and nav-link class to the Profile link
        profileLink = `<li class="nav-item w-100 w-lg-auto"><a class="nav-link" href="#" id="profile-btn">Profile</a></li>`;

        authButton = `
            <button class="logout-btn" id="logout-btn">
                <i class="fa-solid fa-arrow-right-from-bracket"></i> Sign Out
            </button>
        `;
    } else {
        if (!path.includes("signIn.html")) {
            authButton = `<a href="${pages.login}" class="btn primary-btn btn-signup ms-lg-3">Sign In</a>`;
        } else {
            authButton = ""; // Leave it empty on the login page
        }
        }

header.innerHTML = `
    <nav class="navbar navbar-expand-lg">
        <div class="container-fluid d-flex align-items-center">
            
            <!-- 1. Logo (Takes equal flexible space on mobile to push toggler to center) -->
            <div class="d-flex justify-content-start order-1 flex-grow-1 flex-lg-grow-0">
                <a href="${pages.home}" class="navbar-brand logo d-flex align-items-center gap-2 m-0">
                    <img src="/assets/codeExam Logo.png" height="36" width="36" alt="Logo">
                    <span>CodeExam</span>
                </a>
            </div>

            <!-- 2. Burger Menu (Perfectly pinched in the center) -->
            <div class="order-2 d-lg-none">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>

            <!-- 3. Action Buttons (Takes equal flexible space on mobile to push toggler to center) -->
            <div class="d-flex justify-content-end align-items-center gap-3 order-3 order-lg-3 flex-grow-1 flex-lg-grow-0">
                <button id="theme-toggle-btn" class="nav-link p-0" style="background: none; border: none; cursor: pointer;">
                    <i id="theme-icon" class="fa-solid fa-moon"></i>
                </button>
                ${authButton}
            </div>

            <!-- 4. Collapsible Navigation Links -->
            <div class="collapse navbar-collapse order-4 order-lg-2" id="navbarContent">
                <ul class="navbar-nav mx-auto mb-2 mb-lg-0 align-items-center text-center gap-2 gap-lg-4 mt-3 mt-lg-0">
                    <li class="nav-item w-100 w-lg-auto"><a class="nav-link" href="${pages.home}">Home</a></li>
                    <li class="nav-item w-100 w-lg-auto"><a class="nav-link" href="${pages.home}#contact-section">Contact</a></li>
                    <li class="nav-item w-100 w-lg-auto"><a class="nav-link" href="${pages.home}#about-section">About</a></li>
                    ${dashboardLink}
                    ${profileLink}
                </ul>
            </div>

        </div>
    </nav>
`;


    // --- Burger Menu Closing Logic ---
    const navbarContent = document.getElementById("navbarContent");
    const navbarToggler = document.querySelector(".navbar-toggler");

    if (navbarContent && navbarToggler) {
        // Helper function to safely close the menu
        const closeBurgerMenu = () => {
            if (navbarContent.classList.contains("show")) {
                // If Bootstrap 5 JS is globally available, use its API
                if (typeof bootstrap !== "undefined") {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarContent) || new bootstrap.Collapse(navbarContent, { toggle: false });
                    bsCollapse.hide();
                } else {
                    // Fallback for Vanilla JS: Trigger a click on the toggler
                    navbarToggler.click();
                }
            }
        };

        // 1. Close menu when clicking any navigation link
        const navLinks = navbarContent.querySelectorAll(".nav-link, .btn");
        navLinks.forEach(link => {
            link.addEventListener("click", closeBurgerMenu);
        });

        // 2. Close menu when clicking outside the boundary
        document.addEventListener("click", (event) => {
            const isClickInsideMenu = navbarContent.contains(event.target);
            const isClickOnToggler = navbarToggler.contains(event.target);

            // If the click is outside both the menu and the button, and the menu is open, close it
            if (!isClickInsideMenu && !isClickOnToggler) {
                closeBurgerMenu();
            }
        });
    }

    const profileBtn = document.getElementById("profile-btn");
    if (profileBtn) {
        profileBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const profilePanel = document.getElementById("user-profile");
            if (profilePanel) {
                profilePanel.style.display = profilePanel.style.display === "flex" ? "none" : "block";
            }
        });
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            sessionStorage.removeItem("auth");
            location.href = pages.home;
        });
    }

    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    const themeIcon = document.getElementById("theme-icon");
    
    // Check local storage on load and apply if dark
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
        document.body.setAttribute("data-theme", "dark");
        themeIcon.classList.replace("fa-moon", "fa-sun");
    }

    // Toggle click event
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const isDark = document.body.getAttribute("data-theme") === "dark";
            
            if (isDark) {
                document.body.removeAttribute("data-theme");
                localStorage.setItem("theme", "light");
                themeIcon.classList.replace("fa-sun", "fa-moon");
            } else {
                document.body.setAttribute("data-theme", "dark");
                localStorage.setItem("theme", "dark");
                themeIcon.classList.replace("fa-moon", "fa-sun");
            }
        });
    }
}
