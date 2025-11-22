🚀 Job Portal - Full Stack Application
A comprehensive Job Portal application built with Spring Boot (Backend) and React (Frontend). This platform allows users to search for jobs, apply with cover letters, and track their application status via a personalized dashboard.

🛠️ Tech Stack
Frontend:
React.js (Hooks, State Management)
Tailwind CSS (Styling & Responsive Design)
Lucide React (Icons)
Fetch API (Backend Integration)

Backend:
Java 17
Spring Boot 3+ (Web, Data JPA, Security)
MySQL (Database)
Maven (Build Tool)

✨ Features
Authentication: Secure Login and Registration system.
Role-Based Access: Support for Job Seekers and Employers (logic implemented).
Job Search: Filter jobs by Keyword (Title) and Location.
Job Application: Users can apply to jobs with a Cover Letter. The system automatically links the application to the logged-in user.
User Dashboard:
View real-time statistics (Total Applied, Pending, Rejected).
View history of applied jobs with status badges.
Duplicate Check: Prevents candidates from applying to the same job twice.

⚙️ Setup & Installation
1. Prerequisites
Java JDK 17 or higher
Node.js & npm
MySQL Server

2. Database Setup
Open MySQL Workbench.
Create a database named jobportal_db:
Update the database credentials in backend/springdemo/src/main/resources/application.properties:

3. Backend Setup (Spring Boot)
Navigate to the backend folder:
Bash
cd backend/springdemo

Run the application:
Bash
mvn clean spring-boot:run

3. Frontend Setup (React)
Open a new terminal and navigate to the frontend folder:

Bash
cd frontend/job-portal-frontend
Install dependencies:

Bash
npm install
Start the React server:

Bash
npm start

💾 Dummy Data (SQL)
To populate the database with initial jobs for testing, run this in MySQL:
SQL
INSERT INTO jobs (title, description, location, salary_range, job_type, experience_level, posted_date, status) 
VALUES 
('Junior Java Developer', 'Spring Boot expertise required.', 'Remote', '60k-80k', 'FULL_TIME', 'JUNIOR', NOW(), 'ACTIVE'),
('React Frontend Engineer', 'Build modern dashboards.', 'New York', '90k-120k', 'CONTRACT', 'MID', NOW(), 'ACTIVE'),
('DevOps Engineer', 'AWS and Docker experience.', 'Bengaluru', '15L - 20L', 'FULL_TIME', 'SENIOR', NOW(), 'ACTIVE');

🛡️ License
This project is created for educational and internship purposes.

