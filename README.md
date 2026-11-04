# 💪 Fitness Buddy — AI-Powered Health & Fitness Coach

> **Problem Statement #13** · Powered by **IBM Granite** (`ibm/granite-3-8b-instruct` via watsonx.ai)

Fitness Buddy is an AI-powered personal fitness assistant that provides personalized workout plans, nutrition guidance, motivational tips, and habit tracking.

## 🚀 Features

| Feature | Description |
|---|---|
| 💬 AI Chat Coach | Conversational fitness and nutrition guidance powered by IBM Granite |
| 🏋️ Workout Planner | Personalized home workout plans based on fitness level, goals, duration, and equipment |
| 🥗 Nutrition Planner | Personalized meal suggestions based on dietary preferences and calorie targets |
| 📅 Habit Tracker | Track daily health habits, progress, and consistency |

## 🛠️ Technology Stack

- **Frontend:** React 18, CSS3, Lucide Icons, Axios
- **Backend:** Node.js, Express.js
- **AI Model:** IBM Granite 3-8B Instruct
- **AI Platform:** IBM watsonx.ai

## ⚙️ Setup & Installation

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure IBM watsonx.ai

```bash
cp backend/.env.example backend/.env
```

Configure your `backend/.env`:

```env
IBM_WATSONX_APIKEY=your_ibm_cloud_api_key
IBM_WATSONX_URL=https://us-south.ml.cloud.ibm.com
IBM_WATSONX_PROJECT_ID=your_watsonx_project_id
PORT=5000
```

### 3. Run the application

**Backend:**

```bash
npm run dev:backend
```

**Frontend:**

```bash
npm run dev:frontend
```

Open `http://localhost:3000` in your browser.

## 📁 Project Structure

```text
fitness-buddy/
├── backend/
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   └── pages/
│   └── package.json
└── package.json
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat` | AI conversational chat |
| POST | `/api/workout` | Generate workout plans |
| POST | `/api/meal` | Generate meal suggestions |
| GET | `/api/motivation` | Motivational tips |
| GET | `/api/health` | Backend health check |

## 🏗️ Architecture

```text
React Frontend (Port 3000)
        ↕ Axios HTTP
Express Backend (Port 5000)
        ↕ IBM watsonx.ai SDK
IBM Granite Foundation Model
```

## 📋 Problem Statement Compliance

- Personalized home workout recommendations.
- AI-generated motivational tips.
- Nutritious meal suggestions.
- Habit building and consistency tracking.
- IBM Granite integration through watsonx.ai.

## 🔐 Security

Never commit your `backend/.env` file. Use `.env.example` as a configuration template.

---

**Built for Problem Statement #13 — Fitness Buddy | IBM Granite AI**
