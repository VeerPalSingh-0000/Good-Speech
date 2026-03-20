<div align="center">

# 🗣️ SpeechOK (SpeechGood)
### *Empowering Fluency with AI-Guided Speech Therapy*

[![Website](https://img.shields.io/website?up_message=online&url=https%3A%2F%2Fgoodspeech.netlify.app%2F&style=for-the-badge&color=8b5cf6)](https://goodspeech.netlify.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/netlify/53dde07f-ff53-4f6f-9c23-af9e13bded28?style=for-the-badge&logo=netlify)](https://goodspeech.netlify.app/)

**[Explore the Web App](https://goodspeech.netlify.app/) • [Watch Demo](#) • [Request Feature](#)**

</div>

---

## 🌟 Overview

**SpeechGood** is a next-generation, mobile-first speech therapy companion designed to help users overcome stammering and improve fluency. Built using **React v19**, it combines evidence-based therapy techniques with advanced tracking, analytics, and a premium aesthetic to provide a modern, engaging experience.

---

## 🚀 Key Features

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>📈 Smart Progress Tracking</h3>
      <ul>
        <li><b>Daily Streaks:</b> Maintain consistency with automated session tracking.</li>
        <li><b>Session Analytics:</b> Visualize total practice time and session counts.</li>
        <li><b>Real-time Stats:</b> Interactive charts powered by <b>Recharts</b>.</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>📖 Smart Stories & Reading</h3>
      <ul>
        <li><b>PDF Renderer:</b> Integrated native PDF viewing on all devices (mobile/desktop).</li>
        <li><b>Bookmarks:</b> Save your place in stories with page-level bookmarks.</li>
        <li><b>Harry Potter Collection:</b> Includes both text and PDF versions of popular stories.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🌀 Therapy & Exercises</h3>
      <ul>
        <li><b>Breathing Patterns:</b> Animated guides for controlled breathing techniques.</li>
        <li><b>Varnmala Practice:</b> Systematized phonics drills for Hindi speakers.</li>
        <li><b>Tongue Twisters:</b> Curated exercises for articulation and speed.</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>📱 Mobile-First PWA</h3>
      <ul>
        <li><b>Offline Ready:</b> Works without internet via Workbox service workers.</li>
        <li><b>Installable:</b> Add it to your home screen for a native app feel.</li>
        <li><b>Zero Latency:</b> Optimized build using <b>Vite</b> for rapid loading.</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🛠️ Technology Stack

<div align="center">

| Area | Technologies |
|---|---|
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white) |
| **Backend** | ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black) ![Google Auth](https://img.shields.io/badge/Google_Auth-4285F4?style=flat-square&logo=google&logoColor=white) |
| **Libraries** | ![Lucide](https://img.shields.io/badge/Lucide-8b5cf6?style=flat-square) ![Recharts](https://img.shields.io/badge/Recharts-22b5bf?style=flat-square) ![react-pdf](https://img.shields.io/badge/react--pdf-EE220C?style=flat-square) |

</div>

---

## 💻 Installation & Setup

### 1. Prerequisites
- Node.js (version 18+)
- npm or yarn

### 2. Clone the Repository
```bash
git clone https://github.com/VeerPalSingh-0000/Good-Speech.git
cd Good-Speech
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Variables
Create a `.env.local` file in the root and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Run Locally
```bash
npm run dev
```

---

## 🎨 UI & UX Design

- **Premium Dark Mode:** Crafted with a deep slate/blue palette for high accessibility and low eye strain.
- **Glassmorphism:** Suble blur effects and translucent backgrounds for a depth-rich experience.
- **Micro-animations:** Intentional transitions using <b>Framer Motion</b> to guide user attention.
- **Responsive Navigation:** Tiered system with a persistent bottom nav for mobile and an elegant secondary hamburger menu.

---

## 🔒 Security & Privacy

- **State-of-the-Art Auth:** Google Identity integration for zero-friction boarding.
- **Encrypted Storage:** User session data and recordings are secured via **Firebase Firestore Rules**.
- **Data Sovereignty:** All therapy stats are private to the user's account.

---

<div align="center">

Built with ❤️ by **Veer Pal Singh**

[↑ Back to Top](#)

</div>
