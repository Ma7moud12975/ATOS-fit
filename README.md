# ATOS fit

> A real-time fitness tracking web application that uses TensorFlow.js and pose detection to monitor exercise form, count repetitions, and provide feedback — all through your webcam!
> <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/8f867c15-f935-4f8f-999f-68e28bdcf534" />
> <img width="1893" height="1079" alt="image" src="https://github.com/user-attachments/assets/cb737fec-b736-43d0-9337-c34c3c9577d8" />



---

## 🚀 Features

- 🎯 **Real-Time Pose Detection** – Powered by TensorFlow.js and MoveNet/PoseNet  
- 🧠 **Exercise Recognition** – Smart logic to detect current movements  
- 🔁 **Repetition Counting** – Via angle thresholds and state machine logic  
- 🛡️ **Form Feedback** – Real-time correction cues for safer workouts  
- 🧾 **Exercise Library** – Supports multiple common exercises  
- 💬 **Assistant Chatbot** – Built-in chatbot to guide users, answer questions, and suggest form improvements  
- 🥗 **Food Detector** – Use your webcam to identify meals and get nutritional insights *(New Feature)*  
- 📦 **Bar Code Scanner** – Instantly detect product barcodes to fetch calorie & nutrition data *(New Feature)*  


---

## 🛠 Technical Stack

- *Frontend*: React + TypeScript  
- *Styling*: Tailwind CSS  
- *UI Library*: Shadcn UI  
- *Pose Detection*: TensorFlow.js with MoveNet/PoseNet  
- *State Management*: React Hooks + Context API  

---

## 🔐 Privacy First

All pose estimation runs *entirely in-browser*. No video or data is uploaded — your privacy is respected by design.

---

## 🏋 Supported Exercises

| Exercise        | Preview                                                                                                           |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| *Forward Lunge* | ![](https://media.post.rvohealth.io/wp-content/uploads/sites/2/2019/05/PERFECT-SERIES_LUNGE-HORIZONTAL_GRAIN.gif) |
| *Squats*        | ![](https://i.pinimg.com/originals/f9/db/a3/f9dba36451cab8b0b5be6d5ec9fd438a.gif)                                 |
| *Bicep Curls*   | ![](https://i.pinimg.com/originals/68/4d/50/684d50925eabbdf60f66d4bf7013c9ef.gif)                                 |
| *Push-ups*      | ![](https://i.pinimg.com/originals/fd/bb/09/fdbb092b58863e5c86fdb8bb1411fcea.gif)                                 |
| *Pull-ups*      | ![](https://tunturi.org/Blogs/2022/09-pull-up.gif)                                                                |


## 🧪 Getting Started

> Follow these steps to get the app running locally:

### 1. 📦 Clone the repo

bash
git clone https://github.com/Ma7moud12975/Fitness-Tracker-web-v1.git
cd Fitness-Tracker-web-v1


### 2. 📥 Install dependencies

bash
npm install


### 3. 🧪 Start the dev server

bash
npm run dev


### 4. 🌐 Open the app

Go to [http://localhost:3000](http://localhost:3000) in your browser.

### 5. 🎥 Allow camera access

When prompted, *allow* access to your webcam to enable pose detection.

### 6. 🏋 Start exercising!

Choose your exercise, get in position, and the tracker will do the rest!

---

## 🌟 Inspiration

This project was inspired by the Python-based [Fitness Tracker Pro](https://github.com/a1harfoush/Fitness_Tracker_Pro), adapted for the modern web using JS and TensorFlow.js.

![Inspiration](https://github.com/user-attachments/assets/3c369613-96d2-48a4-b302-b330bd863fec)
