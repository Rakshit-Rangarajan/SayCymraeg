<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&height=220&color=0:000000,100:A32ACB&text=SayCymraeg&section=header&fontColor=ffffff&fontAlign=50&fontAlignY=38&animation=scaleIn&fontSize=52&stroke=000000&strokeWidth=1.5" />

<br/>

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-SayCymraeg-A32ACB?style=for-the-badge&logoColor=white)](https://saycymraeg.rakshitr.co.in)
[![Swagger Docs](https://img.shields.io/badge/📄%20Swagger%20API-Docs-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://api.rakshitr.co.in/saycymraeg/api/docs)
[![Portfolio](https://img.shields.io/badge/👤%20Portfolio-rakshitr.co.in-000000?style=for-the-badge)](https://www.rakshitr.co.in)

<br/>

> **An interactive, gamified platform to learn the Welsh language — powered by AI, built with passion.**

<br/>

![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Ollama](https://img.shields.io/badge/Ollama_(Llama_3.1)-000000?style=flat-square&logo=ollama&logoColor=white)

</div>

---

## 📖 Overview

<div align="justify">

SayCymraeg is a full-stack, gamified language learning platform built for Welsh learners. It combines dynamic flashcards, challenging quizzes, AI-powered conversation practice, and community features — all wrapped in a modern, responsive interface.

What started as a small hobby project exploring local language models grew into a feature-rich application with real-time pronunciation feedback, speech recognition, competitive leaderboards, and an AI tutor powered by Llama 3.1. The project was built over the course of a month and became a deep dive into full-stack development, AI integration, and product design — across familiar tools like Python and Firebase, and new ones like Next.js, Flask, and Ollama.

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🃏 **Interactive Flashcards** | Dynamic vocabulary cards with English/Welsh flip. Supports custom AI-generated topic sets. |
| 🧠 **Engaging Quizzes** | Multiple quiz formats to test and reinforce Welsh vocabulary at your own pace. |
| 🤖 **AI Welsh Tutor** | Conversational AI tutor powered by Llama 3.1 via Ollama for natural language practice. |
| 🎙️ **Pronunciation Tutor** | Text-to-speech (gTTS) paired with speech recognition to nail Welsh pronunciation. |
| ✨ **Custom Flashcard Generator** | Generate vocabulary sets on any topic using AI — cooking, travel, tech, and more. |
| 🏆 **Competitive Leaderboard** | Track your progress against other learners in real time. |
| 💬 **Social Chat** | Connect with fellow Welsh learners through an integrated community chat room. |
| 📱 **Fully Responsive** | Seamless experience across desktop, tablet, and mobile. |

---

## 🛠️ Tech Stack

<details>
<summary><b>🖥️ Frontend</b></summary>
<br/>

| Technology | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org/) | React framework with App Router |
| [React 19](https://react.dev/) | UI component library |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe development |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Radix UI](https://www.radix-ui.com/) | Accessible UI primitives |

</details>

<details>
<summary><b>⚙️ Backend</b></summary>
<br/>

| Technology | Purpose |
|---|---|
| [Python 3.9+](https://www.python.org/) | Backend runtime |
| [Flask](https://flask.palletsprojects.com/) | REST API server |
| [Flask-CORS](https://flask-cors.readthedocs.io/) | Cross-origin resource sharing |
| [Swagger UI](https://swagger.io/tools/swagger-ui/) | Interactive API documentation |

</details>

<details>
<summary><b>🤖 AI & Machine Learning</b></summary>
<br/>

| Technology | Purpose |
|---|---|
| [Ollama (Llama 3.1)](https://ollama.com/) | Local AI tutor & flashcard generation |
| [gTTS](https://gtts.readthedocs.io/) | Welsh text-to-speech |
| [SpeechRecognition](https://pypi.org/project/SpeechRecognition/) | Pronunciation evaluation |
| [pydub](https://github.com/jiaaro/pydub) | Audio processing |

</details>

<details>
<summary><b>🔐 Database & Auth</b></summary>
<br/>

| Technology | Purpose |
|---|---|
| [Firebase](https://firebase.google.com/) | Backend-as-a-service platform |
| [Firestore](https://firebase.google.com/docs/firestore) | NoSQL real-time database |
| [Firebase Auth](https://firebase.google.com/docs/auth) | User authentication |

</details>

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18+ and `npm` or `pnpm`
- **Python** v3.9+ and `pip`
- **Ollama** — [install here](https://ollama.com/), then pull the required model:

```bash
ollama pull llama3.1
```

---

### 1 · Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

### 2 · Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```env
GOOGLE_APPLICATION_CREDENTIALS="path/to/your/firebase-adminsdk-key.json"
```

---

### 3 · Run the Application

Open **two terminals** and start both servers:

```bash
# Terminal 1 — Backend API
cd backend && flask run
# → Running at http://127.0.0.1:5000
# → Swagger docs at http://127.0.0.1:5000/swagger
```

```bash
# Terminal 2 — Frontend
cd frontend && npm run dev
# → Running at http://localhost:3000
```

---

## 🔑 Test Account

Use these credentials to explore the app without registering:

| Field | Value |
|---|---|
| **Email** | `test@test.com` |
| **Password** | `password` |

---

## 📂 Project Structure

```
SayCymraeg/
├── frontend/               # Next.js application
│   ├── app/                # App Router pages & layouts
│   ├── components/         # Reusable UI components
│   ├── .env.local          # Firebase client config (not committed)
│   └── package.json
│
├── backend/                # Python Flask API
│   ├── app.py              # Main application entry point
│   ├── requirements.txt    # Python dependencies
│   ├── .env                # Firebase Admin SDK path (not committed)
│   └── venv/               # Virtual environment (not committed)
│
└── README.md
```

---

## 🗺️ Roadmap

- [x] Interactive flashcards with flip animation
- [x] Custom AI-powered flashcard topic generator
- [x] AI Welsh tutor via Llama 3.1
- [x] Pronunciation tutor with speech recognition
- [x] Competitive leaderboard
- [x] Social community chat
- [x] Swagger API documentation
- [ ] Spaced repetition system for flashcards
- [ ] Progress analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Additional Celtic language support (Irish, Scottish Gaelic)

---

## 🖼️ Gallery

<table align="center">
  <tr>
    <td align="center">
      <img width="380" alt="Sign-in" src="https://github.com/user-attachments/assets/6c77dbf3-110f-401c-bcab-bc21aea7ac47" />
      <br/><sub><b>Sign-In Page</b></sub>
    </td>
    <td align="center">
      <img width="380" alt="Dashboard" src="https://github.com/user-attachments/assets/e5467bff-fdf2-4f78-8dfe-6ddd449e7c6e" />
      <br/><sub><b>Dashboard</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img width="380" alt="Flashcards Topics Page" src="https://github.com/user-attachments/assets/978d9437-f4a6-4189-ac0b-cf75317618b5" />
      <br/><sub><b>Flashcard Topics</b></sub>
    </td>
    <td align="center">
      <img width="380" alt="Custom Flashcard Generator" src="https://github.com/user-attachments/assets/a7008072-f55c-4252-8864-a52d46423779" />
      <br/><sub><b>Custom Flashcard Generator</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img width="380" alt="Flashcard Front" src="https://github.com/user-attachments/assets/1fc9ed88-7acc-4e5d-a90d-d353cf06c125" />
      <br/><sub><b>Flashcard — English Side</b></sub>
    </td>
    <td align="center">
      <img width="380" alt="Flashcard Back" src="https://github.com/user-attachments/assets/d8c71fbd-0165-4052-8600-8e17bdf321ba" />
      <br/><sub><b>Flashcard — Welsh Side</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img width="380" alt="Pronunciation Tutor" src="https://github.com/user-attachments/assets/c98af1e7-ae65-4e5b-8b70-9ded08fcd7f1" />
      <br/><sub><b>Pronunciation Tutor</b></sub>
    </td>
    <td align="center">
      <img width="380" alt="AI Welsh Tutor" src="https://github.com/user-attachments/assets/bedbaace-3001-4aca-9d7d-bc7b41a8b1ef" />
      <br/><sub><b>AI Welsh Tutor Chat</b></sub>
    </td>
  </tr>
</table>

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository
2. **Create** a feature branch — `git checkout -b feature/your-feature`
3. **Commit** your changes — `git commit -m 'Add some feature'`
4. **Push** to the branch — `git push origin feature/your-feature`
5. **Open** a Pull Request

---

## 👤 Author

**Rakshit Rangarajan**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/rakshit-rangarajan-2084b2211/)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:rakshitr2000@gmail.com)
[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=about.me&logoColor=white)](https://www.rakshitr.co.in)

---

<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&height=120&color=0:A32ACB,100:000000&section=footer" />

*Cymru am byth 🏴󠁧󠁢󠁷󠁬󠁳󠁥 — Wales forever*

</div>
