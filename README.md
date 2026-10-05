# PlantInfo 🌿

A comprehensive, dual-platform Botanical Encyclopedia and Plant Identification tool. This repository contains both a **Native Android Kotlin** application and a cross-platform **React PWA** powered by AI Computer Vision.

## 📱 Platforms

### 1. PlantInfo AI (Web / PWA)
Located in the `/web` directory, this is a highly engineered Progressive Web Application.
- **AI Plant Detection:** Uses your device's camera to identify plants via the Google Gemini 2.5 Flash AI model.
- **Wiki Explorer:** Connects directly to the live Wikipedia API for deep botanical research.
- **Live Demo:** [https://plantinfo-web.vercel.app](https://plantinfo-web.vercel.app)

### 2. PlantInfo Native (Android)
Located in the `/app` directory, this is the core Native Android codebase written in Kotlin.
- Clean MVVM architecture (Model-View-ViewModel).
- Full suite of native Android Activities (Dashboard, Login, Details).
- Structured API communication interfaces via Retrofit.

## 🚀 Setup & Installation

### Running the Web App (PWA)
```bash
cd web
npm install
npm run dev
```

### Running the Android App
1. Open the root `PlantInfo` folder in **Android Studio**.
2. Let Gradle sync dependencies.
3. Click "Run" to build the APK and launch it on your emulator or physical device.

## 🛠️ Architecture
- **Web Frontend:** React, Vite, Tailwind CSS 4, Google GenAI SDK.
- **Android Native:** Kotlin, Gradle, XML Layouts, Material Design.
- **CI/CD:** Automated GitHub Actions pipeline (`deploy.yml`) for seamless Web deployment.

## 🌐 Live Link
You can access the live Web version here:
**[https://plantinfo-web.vercel.app](https://plantinfo-web.vercel.app)**
*(Make sure to update your GitHub repository's "About" section with this URL!)*
