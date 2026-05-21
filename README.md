# Hunar & Hifazat - Daily Wage Workers Agentic Platform

Humsafar AI is a dual-localized (English and Urdu) React Native mobile application and FastAPI backend service designed to empower, secure, and upskill daily-wage workers (painters, electricians, plumbers, carpenters, and masons) in Pakistan. 

By integrating Google Gemini Pro, real-time weather metrics, and digital escrow accounts, the platform delivers structural support to Pakistan's informal labor sector.

---

## 🚀 Core Features

### 1. 🔍 AI Scout Agent (Web-Scouting Bypass)
* **Bypass Anti-Bot Blocks**: Dynamically bypasses Cloudflare anti-bot blocks on job platforms (such as OLX, Rozee.pk, and Mustakbil) by orchestrating programmatic Google Searches.
* **Smart Matching**: Employs Gemini to parse and match workers to verified, nearby job listings based on their specific skill categories and coordinates.
* **Source Reference Links**: Captures and displays direct URL badges for all scouted jobs so workers can trace them directly in their browsers.

### 2. 🛡️ AI Guardian Agent (Wage & Safety Escrow)
* **Financial Protection**: Integrates an Escrow Wallet tied to mobile account channels (like Easypaisa/JazzCash) to secure wage deposits before work begins.
* **Verification Proof**: Confirms task completion using simulated computer vision analysis on uploaded photos to immediately release escrowed wages to the worker's wallet.
* **Employer Safety Vetting**: Aggregates community safety logs, warning workers via audio alerts if a contractor phone number has active fraud or non-payment reports.

### 3. 📈 AI Economic Engine & Weather Advisory
* **Bilingual Work Advice**: Leverages Gemini to synthesize real-time meteorological conditions (retrieved from Open-Meteo) and worker skills to deliver highly practical outdoor safety suggestions.
* **Live Market Pulse**: Shows trade demand scores, average daily wage rates, and dynamic upskilling recommendation masterclasses.
* **Labor Squad Builder**: Encourages trade workers to coordinate in localized squads to purchase equipment collectively and bid on larger commercial contracts.

### 4. 💳 Digital Labor Council Identity (DLC)
* Renders a digital identity card certified by the simulated Digital Labor Council of Pakistan, complete with a security QR code, dynamic verification status, profile overview, and a direct funds-withdrawal portal.

---

## 📂 Project Structure

```
nativeee/
├── backend/                  # FastAPI Backend Server
│   ├── app/
│   │   ├── routers/          # API Routers (auth, jobs, trust, economic, etc.)
│   │   ├── database.py       # SQLAlchemy Connection & Configuration
│   │   ├── models.py         # DB Models (User, Job, SafetyRecord)
│   │   ├── schemas.py        # Pydantic Schemas
│   │   └── main.py           # FastAPI Application Bootloader
│   ├── .env                  # Environment Credentials (API Keys, SMTP config)
│   └── Pipfile               # Pipenv Python Dependencies
│
└── MyApp/                    # React Native Frontend (TSX)
    ├── src/
    │   ├── components/       # Reusable components & API Client
    │   ├── context/          # AgentContext (Global AI Voice & Escrow state)
    │   ├── screens/          # Application Screens (Dashboard, JobDetail, IdCard, Welcome, etc.)
    │   └── services/         # Frontend API Services
    ├── clean_build.bat       # Cleanup & Build compilation script
    └── package.json          # React Native Node Dependencies
```

---

## ⚙️ Setup & Installation

### Prerequisite Environment Variables
Create a `.env` file inside the `backend` directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=postgresql://user:password@localhost:5433/WageWorkers # Or SQLite fallback
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_smtp_email@gmail.com
SMTP_PASS=your_smtp_app_password
```

### 1. Backend Server Setup
From the `backend` directory, run:
```bash
# Enter environment and install packages
pipenv shell
pipenv install

# Boot backend API
uvicorn app.main:app --reload
```

### 2. Mobile App Setup
From the `MyApp` directory, run:
```bash
# Install dependencies
npm install

# Reverse Android ports to forward local server communication
adb reverse tcp:8000 tcp:8000

# Start Metro Bundler & Launch application on connected device
npm run android
```

---

## 📦 Creating Standalone Android APK

If you need to distribute the application for local testing or demo presentations, follow these commands to compile the APK:

```cmd
# Navigate to the Android folder of your app
cd MyApp/android

# Compile Debug APK (Signed with development keys)
.\gradlew assembleDebug
```
* **Output Path**: Your generated APK will be stored at:  
  `MyApp/android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🤝 Troubleshooting & Local Development Tips
* **Port Forwarding**: Always ensure `adb reverse tcp:8000 tcp:8000` is executed when running on a physical Android device over USB.
* **Build Clean**: If compilation errors or file locks occur due to Gradle cache, run the root script:  
  `.\clean_build.bat`
