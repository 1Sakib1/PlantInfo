 🌱 PlantExplorer App – NIT3213 Assignment Project

This is a native Android application built as part of the **NIT3213 – Mobile Application Development** unit at Victoria University. The app is designed to help users **log in** and explore a curated list of local plants using a dynamic **REST API**.

---

 🔍 Project Overview

**PlantExplorer** allows authenticated users to view detailed information about local plants, including:
- Common and scientific names
- Care levels
- Light requirements
- Descriptions

The app uses **Retrofit** to fetch data from a cloud-based API and supports a clean user experience with **Bottom Navigation** between screens.

---

🔧 Features

- 🔐 **User Login**
  - Validates credentials using a remote API (`POST /sydney/auth`)
- 📊 **Dashboard**
  - Displays a dynamic list of plants with RecyclerView
- 🔍 **Details Screen**
  - Shows full information about each plant
- 🧭 **Bottom Navigation**
  - Smooth navigation between Dashboard and Details
- 📶 **Internet Connectivity Check**
  - Notifies user if no internet is available
- 📲 **Material Design UI**
  - Modern look using Material Components and ViewBinding

---

 ⚙️ Tech Stack
----------------------------------------------------------------------------
| Technology                  | Description                                |
|-----------------------------|--------------------------------------------|
| **Kotlin**                  | Main programming language                  |
| **Android Studio**          | Development environment                    |
| **Retrofit2**               | HTTP client for API calls                  |
| **Coroutines**              | Asynchronous programming                   |
| **ViewBinding**             | Type-safe access to views                  |
| **Fragments**               | Modular UI management                      |
| **BottomNavigationView**    | User-friendly navigation                   |

---

📡 API Information

- **Base URL**: `https://nit3213api.onrender.com/`
- **Authentication Endpoint**: `POST /sydney/auth`
- **Plants Endpoint**: `GET /dashboard/{keypass}`

**Sample credentials:**
```json
{
  "username": "Nazmus",
  "password": "s8116515"
}
