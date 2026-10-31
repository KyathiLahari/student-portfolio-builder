# Student Portfolio Builder

A full-stack web application that helps students create, customize, manage, and showcase their professional portfolios.

## 🌐 Live Demo

**Website:** https://student-portfolio-builder-psi.vercel.app/

## 📌 About the Project

Student Portfolio Builder is a web-based application designed to help students build professional portfolios without needing advanced web development knowledge.

Students can enter their personal information, education details, skills, projects, and social links, choose from different portfolio templates, and save their portfolios for future editing.

## ✨ Features

- Create and manage multiple portfolios.
- Choose from 8 different portfolio templates.
- Add personal information and profile photos.
- Add career objectives and education details.
- Showcase technical skills and projects.
- Include GitHub and LinkedIn profile links.
- Edit, preview, and delete saved portfolios.
- Store portfolio information in MongoDB.
- Responsive web interface.

## 🎨 Available Templates

1. Midnight Developer
2. Minimal Professional
3. Gradient Creative
4. Terminal Hacker
5. Cyberpunk Neon
6. Elegant Editorial
7. Glassmorphism
8. Bento Grid

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Vite | Frontend development and build tool |
| Node.js | Backend runtime |
| Express.js | Backend API |
| MongoDB Atlas | Database |
| Mongoose | MongoDB object modeling |
| JavaScript | Application functionality |
| CSS | Styling and layout |
| Vercel | Frontend deployment |
| Render | Backend deployment |
| GitHub | Version control and source code hosting |

## ⚙️ System Architecture

The application follows a full-stack architecture:

- **Frontend:** React.js communicates with the backend through API requests.
- **Backend:** Node.js and Express.js handle application requests and portfolio operations.
- **Database:** MongoDB Atlas stores portfolio information.
- **Deployment:** The frontend is hosted on Vercel, and the backend is hosted on Render.

## 🚀 Running the Project Locally

### Prerequisites

- Node.js and npm
- MongoDB Atlas account or a MongoDB database
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the Project

```bash
cd student-portfolio-builder
```

### 3. Start the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

Start the backend:

```bash
npm run dev
```

### 4. Start the Frontend

Open a second terminal at the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

http://localhost:5173

## 📂 Project Structure

```text
student-portfolio-builder/
│
├── backend/
│   ├── src/
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── README.md
├── project-presentation.pptx
├── project-documentation.docx
└── project-source-code.zip
```

*The presentation, documentation, and ZIP files should be added to the repository using these filenames or updated in this section to match your actual filenames.*

## 📸 Project Screenshots

Visit the live website to explore the portfolio dashboard, editor, templates, and preview pages.

## 🔮 Future Enhancements

- Download portfolios directly as PDF files.
- Generate unique public sharing links.
- Add user authentication.
- Add more portfolio templates.
- Improve portfolio customization options.

## 👩‍💻 Developed By

**Student Portfolio Builder**  
Full Stack Development Mini Project

## 📄 Project Resources

- [Live Website](https://student-portfolio-builder-psi.vercel.app/)
- [Backend Deployment](https://student-portfolio-builder-2.onrender.com)

