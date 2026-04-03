# My Tasks — MERN Stack Todo App

A full-stack Todo application built with MongoDB, Express, React, and Node.js.
It includes user authentication, task management, and filtering features.

---

## Project Objective

The objective of this project is to develop a full-stack task management application using the MERN stack that allows users to securely manage 
their daily tasks with authentication, real-time updates, and efficient data storage.

---

## Project Description

My Tasks is a full-stack web application designed to help users manage their daily tasks efficiently. It provides secure authentication using 
JWT, allowing users to create, update, delete, and track tasks.

The application follows a client-server architecture where the frontend is built using React and communicates with a Node.js and Express 
backend. MongoDB Atlas is used for cloud-based data storage.

The app includes task filtering, progress tracking, and user profile management features, making it a complete productivity tool.

---

## What This App Can Do

- Create a new account with name, age, email, and password
- Log in and log out securely using JWT tokens
- Add new tasks with a title and description
- Mark tasks as complete or incomplete
- Delete tasks
- Filter tasks by All, Pending, or Completed
- View a progress ring showing completed tasks
- Edit your account profile (name, age, email)
- Works on any modern browser

---

## Tech Stack

### Frontend
| Technology | Description |
|---|---|
| React (Vite) | Builds the user interface |
| Axios | Sends API requests to the backend |
| React Toastify | Displays success and error notifications |
| CSS Variables | Handles theming and styling |

### Backend
| Technology | Description |
|---|---|
| Node.js | Runs the server |
| Express.js | Handles API routes |
| MongoDB Atlas | Stores user and task data in the cloud |
| Mongoose | Manages MongoDB data |
| JWT | Handles secure authentication |
| Bcrypt | Hashes and protects passwords |
| Dotenv | Manages environment variables |
| CORS | Enables frontend-backend communication |

---

## Project Folder Structure
```
Major project/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── logo.png
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── api.js
│   │   ├── Login.jsx
│   │   ├── Login.css
│   │   ├── Register.jsx
│   │   ├── Register.css
│   │   ├── Account.jsx
│   │   ├── Account.css
│   │   ├── TaskForm.jsx
│   │   ├── TaskForm.css
│   │   ├── TaskList.jsx
│   │   ├── TaskList.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── jsconfig.json
│   └── package.json
│
├── screenshots/
│   ├── account section.png
│   ├── completed task filter.png
│   ├── login page.png
│   ├── new account page.png
│   ├── no task.png
│   ├── pending task filter.png
│   ├── task added.png
│   └── task completed.png
│
└── README.md
```

---

## How to Install and Run

### Step 1 — Prerequisites

- Node.js (v18 or higher) — https://nodejs.org
- MongoDB Atlas account — https://www.mongodb.com/atlas
- VS Code — https://code.visualstudio.com

---

### Step 2 — Setup the Backend

cd "Major project/backend"

npm install

Update the .env file:

MONGO_URI=mongodb+srv://yourname:yourpassword@cluster0.xxxxx.mongodb.net/todo-db?retryWrites=true&w=majority
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=mysecretjwt2024todoapp

npm run dev

---

### Step 3 — Setup the Frontend

cd "Major project/frontend"

npm install

npm run dev

---

### Step 4 — Run the App

http://localhost:5173

---

## API Endpoints

### Auth Routes — /api/auth

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| POST | /api/auth/register | Register a new user | No |
| POST | /api/auth/login | Log in | No |
| GET | /api/auth/me | Get current user | Yes |
| PUT | /api/auth/update | Update profile | Yes |

### Task Routes — /api/tasks

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| GET | /api/tasks | Get all tasks | Yes |
| POST | /api/tasks | Create a task | Yes |
| PUT | /api/tasks/:id | Update a task | Yes |
| DELETE | /api/tasks/:id | Delete a task | Yes |

Protected means authentication is required.

---

## API Explanation

- Authentication APIs handle user registration, login, and profile updates using JWT tokens.
- Task APIs allow users to perform CRUD operations (Create, Read, Update, Delete) on tasks.
- Protected routes require a valid token sent in headers for authorization.

---

## Database Collections

### users collection

{
  "_id": "auto-generated",
  "name": "Om Chandrakar",
  "age": 20,
  "email": "example@gmail.com",
  "password": "hashed password",
  "createdAt": "2026-03-29",
  "updatedAt": "2026-03-29"
}

### tasks collection

{
  "_id": "auto-generated",
  "title": "Complete the project",
  "description": "Finish by Friday",
  "completed": false,
  "createdAt": "2026-03-29",
  "updatedAt": "2026-03-29"
}

Passwords are never stored as plain text.
They are securely hashed using Bcrypt.

---

## Environment Variables

| Variable | Description |
|---|---|
| MONGO_URI | MongoDB Atlas connection string |
| PORT | Backend server port |
| CLIENT_ORIGIN | Frontend URL |
| JWT_SECRET | Secret key for authentication |

Never share your .env file. Add it to .gitignore.

---

## How to View Data on MongoDB Atlas

1. Go to https://cloud.mongodb.com
2. Open your cluster
3. Click Browse Collections
4. View:
   - todo-db → users
   - todo-db → tasks

---

## Common Errors and Fixes

| Error | Solution |
|---|---|
| ECONNREFUSED | Start the backend server |
| MongoDB connection failed | Check MONGO_URI |
| Cannot reach server | Ensure both servers are running |
| Invalid credentials | Check email/password |
| Port already in use | Run taskkill /f /im node.exe |

---

## Challenges Faced

- Implementing secure authentication using JWT tokens
- Managing state between frontend and backend
- Handling API errors and validation
- Connecting MongoDB Atlas with proper configuration
- Ensuring smooth UI updates after task operations

---

## How to Start the App

Terminal 1 — Backend:
cd "Major project/backend"
npm run dev

Terminal 2 — Frontend:
cd "Major project/frontend"
npm run dev

Then open http://localhost:5173

---

## Screenshots

### Login Page

![Login page](<screenshots/login page.png>)

### New Account Page

![New Account Page](<screenshots/new account page.png>)

### Account Section

![Account Section](<screenshots/account section.png>)

### No Task

![No Task](<screenshots/no task.png>)

### Task Added/All Tasks Filter

![Task Added](<screenshots/task added.png>)

### Task Completed

![Task Completed](<screenshots/task completed.png>)

### Pending Tasks Filter

![Pending Task](<screenshots/pending task filter.png>)

### Completed Tasks Filter

![Comleted Tasks Filter](<screenshots/completed task filter.png>)

---

## Built By

Om Chandrakar  
Roll No: WD-FSWD-A4/FEB-8962
MERN Stack Todo Application — Major Project 2026
