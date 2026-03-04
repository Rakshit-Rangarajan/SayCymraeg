<div>
  <img width="100%" src="https://capsule-render.vercel.app/api?type=waving&height=250&color=0:000000,100:A32ACB&text=SayCymraeg&section=header&fontColor=ffffff&fontAlign=50&fontAlignY=35&animation=scaleIn&stroke=000000&strokeWidth=2" alt="# SayCymraeg 🏴󠁧󠁢󠁷󠁬󠁳󠁿" />
</div>

<div align="right">
<b>Author:</b> Rakshit Rangarajan
</div>

<hr>

## 📖 Overview

SayCymraeg is an interactive and gamified web application designed to help users learn the Welsh language. The platform provides a modern, engaging learning experience through a variety of tools, including dynamic flashcards, challenging quizzes, and AI-powered features. It also includes social elements like a chat and competitive leaderboard. This project was developed as the final submission for the CMT400 Project module.

---

## ✨ Key Features

* **Interactive Flashcards:** A dynamic system for learning and memorizing Welsh vocabulary.
* **Engaging Quizzes:** Test your knowledge with a variety of quiz formats.
* **AI-Powered Practice:** Utilizes **Llama 3.1 via Ollama** for dynamic, AI-driven language practice.
* **Text-to-Speech & Speech Recognition:** gTTS and SpeechRecognition integration for audio learning and pronunciation practice.
* **Social Chat & Leaderboard:** Connect with other learners and track your progress competitively.
* **Responsive Design:** A fully responsive UI that works seamlessly on desktop and mobile devices.

---

## 🛠️ Technology Stack

* **Frontend:** <br>
      <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 14" /></a>
      <a href="https://react.dev/"><img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" /></a>
      <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
      <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
      <a href="https://www.radix-ui.com/"><img src="https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radixui&logoColor=white" alt="Radix UI" /></a>
* **Backend (API):** <br>
      <a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" /></a>
      <a href="https://flask.palletsprojects.com/"><img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" /></a>
      <a href="https://flask-cors.readthedocs.io/"><img src="https://img.shields.io/badge/Flask--CORS-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask-CORS" /></a>
* **AI & Machine Learning:** <br>
      <a href="https://ollama.com/"><img src="https://img.shields.io/badge/Ollama_(Llama_3.1)-000000?style=for-the-badge&logo=ollama&logoColor=white" alt="Ollama" /></a>
      <a href="https://gtts.readthedocs.io/"><img src="https://img.shields.io/badge/gTTS-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="gTTS" /></a>
      <a href="https://pypi.org/project/SpeechRecognition/"><img src="https://img.shields.io/badge/SpeechRecognition-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="SpeechRecognition" /></a>
      <a href="https://github.com/jiaaro/pydub"><img src="https://img.shields.io/badge/pydub-CC292B?style=for-the-badge&logo=python&logoColor=white" alt="pydub" /></a>
* **Database & Auth:** <br>
      <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" /></a>
      <a href="https://firebase.google.com/docs/firestore"><img src="https://img.shields.io/badge/Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firestore" /></a>
      <a href="https://firebase.google.com/docs/auth"><img src="https://img.shields.io/badge/Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase Authentication" /></a>
* **API Documentation:** <br>
      <a href="https://swagger.io/tools/swagger-ui/"><img src="https://img.shields.io/badge/Swagger_UI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger UI" /></a>

---

## 🚀 Getting Started

Follow these instructions to get the full application (frontend and backend) running locally.

### Prerequisites

* Node.js (v18 or later) & `npm` or `pnpm`
* Python (v3.9 or later) & `pip`
* **Ollama with Llama 3.1:** You must have [Ollama](https://ollama.com/) installed and running. You also need to pull the Llama 3.1 model by running the following command in your terminal:
  ```bash
  ollama pull llama3.1
  ```

### 1. Frontend Setup (Next.js)

1.  **Navigate to the frontend directory** (assuming it's the root or a `/frontend` folder).
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    pnpm install
    ```
3.  **Set up environment variables:**
    * Create a file named `.env.local` in the frontend directory.
    * Add your Firebase client-side configuration keys:
        ```
        NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
        NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
        ```

### 2. Backend Setup (Python Flask API)

1.  **Navigate to the backend directory** (e.g., `/api` or `/backend`).
2.  **Create a virtual environment (Recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```
3.  **Install dependencies from `requirements.txt`:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Set up environment variables:**
    * Create a file named `.env` in the backend directory.
    * Add the path to your Firebase Admin SDK key:
        ```
        GOOGLE_APPLICATION_CREDENTIALS="path/to/your/firebase-adminsdk-key.json"
        ```

---

## 🏃 Usage

You need to run both the frontend and backend servers simultaneously.

1.  **Start the Backend API Server:**
    * In your backend directory terminal:
    ```bash
    flask run
    ```
    * The API will typically be available at `http://127.0.0.1:5000`.
    * API documentation can be viewed at `http://127.0.0.1:5000/swagger`.

2.  **Start the Frontend Development Server:**
    * In a **new terminal**, navigate to your frontend directory:
    ```bash
    npm run dev
    ```
    * Open [http://localhost:3000](http://localhost:3000) in your browser.

### Test Account

Use the following account to log in and explore the application:

* **Email:** `test@test.com`
* **Password:** `password`

---

## 📂 Project Structure

```
SayCymraeg/
├── frontend/      # Next.js application files
│   ├── app/
│   ├── components/
│   └── ...
├── backend/       # Python Flask API files
│   ├── app.py
│   ├── requirements.txt
│   └── venv/
└── README.md
```

---

<div align="center">
  <a href="https://linkedin.com/in/rakshit-rangarajan-2084b2211/" target="_blank"><img src="https://img.shields.io/badge/LinkedIn-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
  <a href="mailto:rakshitr2000@gmail.com" target="_blank"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>
  <a href="https://www.rakshitr.co.in" target="_blank"><img src="https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=about.me&logoColor=white" alt="Website" /></a>
</div>
