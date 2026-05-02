


🚀 Human Pattern Workspace (TaskQuest)
A professional, full-stack Task Management System designed for high-performance teams. This application allows Project Managers (Admins) to assign tasks, set priorities, and track progress in real-time, while providing Members with a streamlined interface to manage their daily contributions.

🔗 Live Demo
Frontend: https://task-manager-five-delta-94.vercel.app/team


Backend API: https://task-manager-bk86.onrender.com


⚠️ Note on Cold Starts
This project is hosted on Render's Free Tier.

Idle Sleep: The backend service automatically "spins down" after 15 minutes of inactivity.

Wake-up Time: If you encounter a "Network Error" or a slow response on your first login attempt, please wait 60 seconds for the server to wake up and then refresh the page.

Stability: Once the initial connection is established, the application will perform at normal speeds for the remainder of your session.

📸 Project Preview

1. Professional Dashboard
A high-level view of pending, accepted, and active assignments.
<img width="1533" height="914" alt="Screenshot 2026-05-01 at 10 57 13 AM" src="https://github.com/user-attachments/assets/4cf1c443-17c7-4ac5-b8fd-54a6adeb88e9" />

3. Task Assignment (Admin)
The modal interface for creating and assigning tasks to specific team members.

4. User Authentication
Secure login and registration with role-based access control.
<img width="1536" height="917" alt="Screenshot 2026-05-01 at 10 56 39 AM" src="https://github.com/user-attachments/assets/64a650af-b1c2-4397-ba64-b85384452274" />
<img width="1536" height="960" alt="Screenshot 2026-05-01 at 10 12 53 AM" src="https://github.com/user-attachments/assets/de822963-0f90-404f-8b45-3fc45cf0f4fc" />

🛠 Tech Stack
Frontend: React.js, Vite, Tailwind CSS, Framer Motion (Animations), Lucide-React (Icons).

Backend: Node.js, Express.js.

Database: MongoDB Atlas (NoSQL).

Deployment: Vercel (Frontend), Render (Backend).

State Management: React Context API.

✨ Key Features
Role-Based Access (RBAC): Distinct dashboards and capabilities for Admins and Members.

Real-Time Alerts: Pulse-animation notifications for new pending tasks.

Task Lifecycle: Full workflow from "Pending" → "Accepted" → "Completed".

Priority Management: Color-coded priority levels (High, Medium, Low).

Mobile-First Design: Fully responsive Sidebar and Workspace layout.

Global Configuration: Centralized API management for seamless cloud deployment.

🚀 Getting Started
1. Clone the repository
Bash
git clone https://github.com/priyeshyadav3002/Task_Manager.git
cd Task_Manager
2. Frontend Setup
Bash
cd frontend
npm install
npm run dev
3. Backend Setup
Bash
cd backend
npm install
# Ensure you have your MONGO_URI and PORT set in your environment variables
npm start
📝 Environment Configuration
To run this project locally, create a src/config.js in the frontend and point it to your local server:

JavaScript
export const API_BASE_URL = "http://localhost:5001";
👨‍💻 Author
Priyesh Yadav

Computer Science (AI & ML Specialization)
