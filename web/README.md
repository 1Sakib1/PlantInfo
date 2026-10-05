# PlantInfo AI 🌿

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)
[![Wikipedia API](https://img.shields.io/badge/Wikipedia-000000?style=for-the-badge&logo=wikipedia&logoColor=white)](https://en.wikipedia.org/w/api.php)

**PlantInfo AI** is a highly engineered Progressive Web Application (PWA) serving as a Computer Vision Botanical Encyclopedia. 

## ✨ Features

- 📸 **AI Plant Detection:** Take pictures of any plant using your device's native camera, and our computer vision integration (powered by Google Gemini) will identify it instantly.
- 🧬 **Botanical Details:** The AI outputs detailed JSON data including common names, scientific names, plant families, and a Wikipedia-style short description, as well as known uses.
- 🔎 **Wiki Explorer:** An integrated search engine querying the live Wikipedia API to fetch deep botanical articles, journals, and images for manual research.
- 📱 **Mobile-First UX:** Built as a responsive web app with bottom navigation, feeling exactly like a native app on both iOS and Android.
- 🚀 **Serverless & Secure:** 100% client-side application. Users securely enter their own API keys via the local settings modal.

## 🛠️ Architecture

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS 4
- **Computer Vision:** `@google/genai` (Gemini 2.5 Flash) for multimodal image analysis.
- **Encyclopedia Data:** Wikipedia REST API (`action=query&prop=extracts`)
- **Deployment:** Fully automated to GitHub Pages via Actions.

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/1Sakib1/PlantInfo.git
   cd PlantInfo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🌐 Live Demo
Visit the live site: [PlantInfo AI Live](https://1Sakib1.github.io/PlantInfo/)

*(Note: You will need a free Google Gemini API key to use the computer vision features.)*
