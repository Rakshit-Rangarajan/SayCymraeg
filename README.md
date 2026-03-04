# SayCymraeg 🏴󠁧󠁢󠁷󠁬󠁳󠁿

**Author:** Rakshit Rangarajan

---

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

* **Frontend:** Next.js 14, React 19, TypeScript, Tailwind CSS, Radix UI
* **Backend (API):** Python, Flask, Flask-CORS
* **AI & Machine Learning:** Ollama (for Llama 3.1), gTTS, SpeechRecognition, pydub
* **Database & Auth:** Firebase (Firestore, Authentication, Storage)
* **API Documentation:** Swagger UI

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

## 📧 Contact

Rakshit Rangarajan - [EMAIL](mailto:rakshitr2000@gmail.com)
