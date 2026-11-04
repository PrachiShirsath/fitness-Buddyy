<<<<<<< HEAD
# 💪 Fitness Buddy — AI-Powered Health & Fitness Coach

> **Problem Statement #13** · Powered by **IBM Granite** (ibm/granite-3-8b-instruct via watsonx.ai)

Fitness Buddy is a conversational AI health and fitness coach that provides personalized workout plans, nutrition guidance, motivational tips, and habit tracking — all powered by IBM's Granite foundation model.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 💬 **AI Chat Coach** | Conversational interface powered by IBM Granite — ask anything about fitness, nutrition, or wellness |
| 🏋️ **Workout Planner** | Generate custom home workout plans based on fitness level, goal, duration, and equipment |
| 🥗 **Nutrition Planner** | Get personalized meal ideas by meal type, dietary preference, and calorie target |
| 📅 **Habit Tracker** | Track daily health habits with weekly streaks, progress bars, and IBM Granite motivational tips |

---

## 🛠️ Technology Stack

- **Frontend**: React 18, CSS3, Lucide Icons, react-markdown, Axios
- **Backend**: Node.js, Express.js
- **AI Model**: `ibm/granite-3-8b-instruct` via **IBM watsonx.ai**
- **IBM Cloud**: watsonx.ai (Lite tier supported)

---

## ⚙️ Setup & Installation

### 1. Clone & Install Dependencies
```bash
# Install all dependencies
npm run install:all
```

### 2. Configure IBM watsonx.ai Credentials
```bash
# Copy example env file
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```
IBM_WATSONX_APIKEY=your_ibm_cloud_api_key
IBM_WATSONX_URL=https://us-south.ml.cloud.ibm.com
IBM_WATSONX_PROJECT_ID=your_watsonx_project_id
PORT=5000
```

#### How to get IBM watsonx credentials:
1. Sign up at [IBM Cloud](https://cloud.ibm.com) (free Lite account)
2. Create a **watsonx.ai** project at [dataplatform.cloud.ibm.com](https://dataplatform.cloud.ibm.com)
3. Go to **Manage → Access (IAM)** → **API Keys** → Create API key
4. Copy your **Project ID** from the watsonx.ai project settings

### 3. Run the Application

**Terminal 1 — Backend:**
```bash
npm run dev:backend
# Starts on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
npm run dev:frontend
# Starts on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
fitness-buddy/
├── backend/
│   ├── server.js          # Express API + IBM watsonx.ai integration
│   ├── .env.example       # Environment variables template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js         # Root component + routing
│   │   ├── components/
│   │   │   ├── Sidebar.js # Navigation + user profile
│   │   │   └── Sidebar.css
│   │   └── pages/
│   │       ├── ChatPage.js        # AI chat interface
│   │       ├── WorkoutPage.js     # Workout generator
│   │       ├── NutritionPage.js   # Meal planner
│   │       └── HabitsPage.js      # Habit tracker
│   └── package.json
└── package.json           # Root scripts
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | Conversational AI chat (multi-turn) |
| `POST` | `/api/workout` | Generate workout plan |
| `POST` | `/api/meal` | Generate meal suggestions |
| `GET`  | `/api/motivation` | Get motivational tip |
| `GET`  | `/api/health` | Health check + config status |

---

## 🏗️ Architecture

```
React Frontend (port 3000)
       ↕ Axios HTTP
Express Backend (port 5000)
       ↕ @ibm-cloud/watsonx-ai SDK
IBM watsonx.ai → ibm/granite-3-8b-instruct
```

---

## 📋 Problem Statement Compliance

- ✅ **Home workout recommendations** — Customized by level, goal, duration, equipment
- ✅ **Motivational tips** — Daily AI-generated motivation via IBM Granite
- ✅ **Nutritious meal ideas** — Meal planner with dietary preferences
- ✅ **Habit-building & consistency** — Visual habit tracker with streak tracking
- ✅ **IBM Cloud Lite / IBM Granite** — Uses `ibm/granite-3-8b-instruct` via watsonx.ai

---

## 🔐 Security Note

Never commit your `backend/.env` file. The `.env.example` file is provided as a template only.

---

*Built for Problem Statement #13 — Fitness Buddy · IBM Granite AI*
=======
# fitness-Buddyy
>>>>>>> 71694f13d1b0029dbb6828b1eeccafa199eea425
