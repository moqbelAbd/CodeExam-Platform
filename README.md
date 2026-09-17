FindExperts
​A professional marketplace connecting people needing assistance with skilled professionals to ask questions, request services, discover job opportunities, and book consultations.
​✨ Core Features
​Dual Profiles: Maintain a basic user account for standard activity, or upgrade to an Expert profile to showcase professional fields, certificates, and portfolio projects.
​Multi-Format Posts: Engage the community through open Questions, request specific Services with a defined budget, or publish Jobs (Full/Part-Time, On-Site/Hybrid/Remote).
​Expert Bidding: Professionals can directly apply to user requests using "I Can Help" for services or "I'm Suitable" for jobs.
​Consultation Booking: A robust scheduling system that handles slot availability, prevents overlapping, and manages meeting states (Pending, Accepted, Rejected, Cancelled, Completed) alongside external meeting URLs.
​Trust & Reputation Engine: Clients provide 1-5 star feedback and grant "Guarantees" after completed interactions to help experts unlock tiered trust badges (Green, Silver, Bronze, Gold).
​Role-Based Dashboards: Dedicated views for users to track saved experts and posts, and for experts to manage their availability, asynchronous inbox, and incoming requests.
​🛠️ Tech Stack
​Frontend: Standard React and Tailwind CSS for a clean, accessible, and responsive user interface (prioritizing 1440px desktop and 375px–430px mobile environments).
​Backend: ASP.NET Core (C#) and Entity Framework for secure, scalable API endpoints and business logic.
​Database: SQL Server utilizing strict schema validations and relational integrity.
​🚦 Local Setup & Installation
​Clone the repository to your local machine.
​Navigate to the frontend directory and run npm install to retrieve all UI dependencies.
​Open the backend solution in your preferred IDE (Visual Studio, JetBrains Rider, or WebStorm/IntelliJ environments).
​Update the appsettings.json connection string to point to your local SQL Server instance (e.g., .\SQLEXPRESS or (localdb)\MSSQLLocalDB).
​Execute Update-Database in the Package Manager Console (or dotnet ef database update) to apply migrations and generate the required tables.
​🔒 Governance & Business Rules
​Access Control: Tiered permissions range from view-only Guests, to Registered Users, to fully privileged Admins handling platform moderation.
​Identity Limits: Users are limited to a single, consolidated expert identity to maintain marketplace integrity.
​Interaction Gates: Reviews and reputation guarantees are strictly locked until a booked interaction is officially marked as Completed.
​Time Validation: Booking requests strictly evaluate the exact date and time of day to ensure users cannot reserve expired slots.

To try the system 
Teacher account: UserName :teacher123 /  Teacher account: UserName :student123.....password: 123



