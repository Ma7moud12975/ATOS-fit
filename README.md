# ATOS Fit: AI-Powered Fitness Coach

<div align="center">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg"/>
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  <img alt="TensorFlow" src="https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white"/>
  <img alt="Internet Computer" src="https://img.shields.io/badge/Internet%20Computer-3B00B9?style=for-the-badge&logo=dfinity&logoColor=white"/>
  <img alt="TailwindCSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
</div>

> A real-time fitness tracking web application that uses TensorFlow.js and pose detection to monitor exercise form, count repetitions, and provide feedback—all through your webcam!
> 
<img width="1898" height="1079" alt="image" src="https://github.com/user-attachments/assets/8516783e-471d-475a-84ce-fcb269300af2" />
<img width="1895" height="1012" alt="image" src="https://github.com/user-attachments/assets/4a5444df-2301-4217-b34c-4ba548f78a25" />
<img width="1896" height="1079" alt="image" src="https://github.com/user-attachments/assets/f5ab2794-93fc-43ed-8307-6c66f0ba998b" />

---

## 📋 Table of Contents

- [🚀 Features](#-features)
- [🔐 Privacy First](#-privacy-first)
- [🛠 Technical Stack](#-technical-stack)
- [🏋 Supported Exercises](#-supported-exercises)
- [📦 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
- [📁 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [🌟 Inspiration](#-inspiration)
- [📄 License](#-license)

---

## 🚀 Features

-   🎯 **Real-Time Pose Detection**: Powered by TensorFlow.js and MoveNet for accurate, in-browser body tracking.
-   🔁 **Automatic Repetition Counting**: Smart algorithms detect and count reps for various exercises based on joint angles and movement patterns.
-   🛡️ **Live Form Feedback**: Get instant visual cues and warnings to correct your posture and prevent injuries.
-   🏋️ **Customizable Workouts**: Tailor your daily workout plan by selecting exercises, sets, and reps to match your fitness level.
-   📊 **Comprehensive Dashboard**: Track your progress with detailed stats, including workout history, calories burned, and personal streaks.
-   💬 **AI Assistant**: An integrated chatbot to answer your fitness questions, explain exercises, and help you understand your performance data.
-   🥗 **AI Food Scanner**: Use your webcam to identify food items and get instant nutritional information (calories, protein, fats).
-   👤 **User Profiles & Onboarding**: A personalized experience with user registration, onboarding, and a detailed profile page to manage your fitness journey.
-   🌐 **Decentralized**: Deployed on the DFINITY Internet Computer for a secure, serverless, and unstoppable application.

---

## 🔐 Privacy First

Your privacy is paramount. All pose estimation and video processing happen **entirely in your browser**. No video data is ever uploaded to a server. What happens on your machine stays on your machine.

---

## 🛠 Technical Stack

-   **Frontend**: [React](https://reactjs.org/) (with Hooks & Context API), [Vite](https://vitejs.dev/)
-   **Backend & Hosting**: [DFINITY Internet Computer](https://internetcomputer.org/)
-   **AI / Machine Learning**: [TensorFlow.js](https://www.tensorflow.org/js) (with MoveNet model)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
-   **Database**: [Dexie.js](https://dexie.org/) (IndexedDB wrapper for client-side storage)
-   **Routing**: [React Router DOM](https://reactrouter.com/)

---

## 🏋 Supported Exercises

This application currently supports a variety of common bodyweight exercises:

# Workout Exercises GIFs

| Exercise           | Preview                                                                                                                         |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| *Push-ups*         | ![](https://i.pinimg.com/originals/47/0d/31/470d318a551421e46c3891fb1f04dd50.gif)                                               |
| *Squats*           | ![](https://i.pinimg.com/originals/27/30/c2/2730c2da52a5f9200caa7e5d8705efde.gif)                                               |
| *Lunges*           | ![](https://i.pinimg.com/originals/66/78/58/6678589817d6026fab7bd23838a8e3eb.gif)                                               |
| *Plank*            | ![](https://i.pinimg.com/originals/8d/51/1e/8d511edb34e36c468aef1027f7642621.gif)                                               |
| *Mountain Climbers*| ![](https://i.pinimg.com/originals/bd/f2/a3/bdf2a3ec9beb4f231033af0d744057bb.gif)                                               |
| *High Knees*       | ![](https://i.pinimg.com/originals/95/db/ae/95dbae82f51c67fc0f5aa30a57da663c.gif)                                               |
| *Burpees*          | ![](https://i.pinimg.com/originals/f0/a3/da/f0a3da2890f6edf4c7b45845fa14e39c.gif)                                               |
| *Wall Sit*         | ![](https://i.pinimg.com/originals/50/bb/fa/50bbfa9d11ce94feff442ad0c1a3e250.gif)                                               |
| *Jumping Jacks*    | ![](https://i.pinimg.com/originals/b4/b5/b9/b4b5b94c119dde698d138b8fe0b8d521.gif)                                               |
| *Side Plank*       | ![](https://i.pinimg.com/originals/4b/bb/42/4bbb42ef233861f68ca244692493cb3d.gif)                                               |

---

## 📦 Getting Started

Follow these steps to get the app running locally on your machine.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v16 or later)
-   [DFX SDK](https://internetcomputer.org/docs/current/developer-docs/setup/install/) (The command-line interface for the Internet Computer)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Ma7moud12975/Fitness-Tracker-web-v1.git
    cd Fitness-Tracker-web-v1
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Start the local IC replica:**
    Open a new terminal window and run the following command. This starts a local, single-node version of the Internet Computer.
    ```sh
    dfx start --background --clean
    ```

4.  **Deploy the canisters:**
    This command registers, builds, and deploys the application to your local replica.
    ```sh
    dfx deploy
    ```

5.  **Start the development server:**
    ```sh
    npm run dev
    ```

6.  **Open the app:**
    Navigate to the local server URL provided by Vite (usually `http://localhost:3000` or a similar port). The application will be running and connected to your local replica.

---

## 📁 Project Structure

The codebase is organized to be modular and scalable. Here is a high-level overview of the `src` directory:

```
src/
├── components/      # Shared UI components (Button, Input, Icon, etc.)
├── contexts/        # React Context for global state (e.g., AuthContext)
├── pages/           # Top-level page components for each route
│   ├── dashboard/   # Dashboard page and its sub-components
│   ├── user-profile/ # User profile page and its tabs
│   └── ...          # Other pages like Login, Register, Onboarding
├── styles/          # Global styles and Tailwind CSS configuration
├── utils/           # Utility functions (e.g., db.js for IndexedDB, helpers)
├── App.jsx          # Main application component
├── index.jsx        # Entry point of the React application
└── Routes.jsx       # Application routing setup
```

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or want to add new features, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourAmazingFeature`).
3.  Make your changes and commit them (`git commit -m 'Add some YourAmazingFeature'`).
4.  Push to the branch (`git push origin feature/YourAmazingFeature`).
5.  Open a Pull Request.

---

## 🌟 Inspiration

This project was inspired by the Python-based [Fitness Tracker Pro](https://github.com/a1harfoush/Fitness_Tracker_Pro), adapted for the modern web using JavaScript, TensorFlow.js, and the Internet Computer.

---
