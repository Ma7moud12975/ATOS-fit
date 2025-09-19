<<<<<<< HEAD
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
<img width="1894" height="1079" alt="Screenshot 2025-09-12 155454" src="https://github.com/user-attachments/assets/24268d17-7c1b-4af6-a050-a61cff7ab415" />
<img width="1876" height="1079" alt="Screenshot 2025-09-12 155527" src="https://github.com/user-attachments/assets/9c110a76-f73c-438d-8d42-b19bf052ede8" />
<img width="1893" height="1079" alt="Screenshot 2025-09-17 125816" src="https://github.com/user-attachments/assets/77cc2ea8-006e-49a3-ad4e-4a01bbbe2ce0" />
<img width="1891" height="1079" alt="Screenshot 2025-09-17 130240" src="https://github.com/user-attachments/assets/5298cd5b-931d-4251-91d2-a8ee85614c54" />

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
=======
# ATOS fit



## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/topics/git/add_files/#add-files-to-a-git-repository) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.com/ma8819496/atos-fit.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.com/ma8819496/atos-fit/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/user/project/merge_requests/auto_merge/)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
>>>>>>> e515a186c4e9ea1c17e8e816ab55729c0a16fadb
