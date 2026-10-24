# Student Portfolio Builder 

A beginner-friendly full-stack application for creating, editing, and previewing a student portfolio using React, Vite, Node.js, Express.js, and MongoDB.

## Features

- Edit a student's profile, career objective, education, skills, projects, and contact details.
- Preview a responsive portfolio page.
- Save and load portfolio data through a REST API.
- Store portfolio data in MongoDB.

## Tech Stack

- **Frontend:** React.js, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Development tools:** npm, VS Code

## Project Structure

```text
student-portfolio-builder/
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── models/
│   │   │   └── Portfolio.js
│   │   └── routes/
│   │       └── portfolioRoutes.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   └── package.json
├── .gitignore
└── README.md
```

## Requirements

- Node.js LTS — https://nodejs.org/
- npm (included with Node.js)
- MongoDB Atlas account or a local MongoDB server
- VS Code (recommended)

## Setup and Run Locally

### 1. Install Node.js

Install Node.js LTS from https://nodejs.org/.

Verify the installation in your terminal:

```bash
node -v
npm -v
```

### 2. Configure MongoDB

The project can use MongoDB Atlas or a local MongoDB server.

For MongoDB Atlas:

1. Create an account at https://www.mongodb.com/atlas.
2. Create a cluster and a database user.
3. Configure Network Access for the environment where your backend runs.
4. Select **Connect → Drivers → Node.js** and copy the connection string.
5. Replace the username, password, and database name with your own values.

Keep your database credentials private.

### 3. Configure and Start the Backend

Open a terminal at the project root:

```bash
cd backend
npm install
```

Create `backend/.env` using `.env.example` as a template. On Windows PowerShell, run:

```powershell
Copy-Item .env.example .env
```

Edit `backend/.env` and set `MONGODB_URI` to your MongoDB connection string.

Start the backend using the available development script:

```bash
npm run dev
```

When startup succeeds, the terminal should report that MongoDB is connected and the API server is running. The default local port is `5000`, unless configured otherwise.

Keep the backend terminal open while running the application locally.

### 4. Start the Frontend

Open a second terminal at the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

http://localhost:5173

### 5. Demonstr
