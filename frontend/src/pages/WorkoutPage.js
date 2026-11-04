import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import "./WorkoutPage.css";

const FITNESS_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const GOALS        = ["Lose Weight", "Build Muscle", "Improve Endurance", "Stay Active", "General Fitness"];
const DURATIONS    = ["15", "20", "30", "45", "60"];
const EQUIPMENT    = ["None (bodyweight only)", "Dumbbells", "Resistance Bands", "Yoga Mat", "Full Home Gym"];

export default function WorkoutPage({ userProfile }) {
  const [form, setForm] = useState({
    fitnessLevel: userProfile?.fitnessLevel || "Beginner",
    goal:         userProfile?.goal         || "General Fitness",
    duration:     "30",
    equipment:    "None (bodyweight only)",
  });
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const generateWorkout = async () => {
    setLoading(true);
    setError("");
    setWorkout(null);
    try {
      const { data } = await axios.post("/api/workout", {
        fitnessLevel: form.fitnessLevel,
        goal:         form.goal,
        duration:     form.duration,
        equipment:    form.equipment,
      });
      setWorkout(data.workout);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate workout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workout-page">
      <div className="page-header">
        <div className="page-header-icon">🏋️</div>
        <div>
          <h1 className="page-title">Workout Planner</h1>
          <p className="page-sub">Get a personalized home workout powered by IBM Granite AI</p>
        </div>
      </div>

      <div className="workout-layout">
        {/* Form */}
        <div className="workout-form-card">
          <h2 className="form-title">🎯 Customize Your Workout</h2>

          <div className="form-section">
            <label className="form-label">Fitness Level</label>
            <div className="option-grid">
              {FITNESS_LEVELS.map((l) => (
                <button
                  key={l}
                  className={`option-btn ${form.fitnessLevel === l ? "active" : ""}`}
                  onClick={() => setForm({ ...form, fitnessLevel: l })}
                >
                  {l === "Beginner" ? "🌱" : l === "Intermediate" ? "🔥" : "⚡"} {l}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Fitness Goal</label>
            <div className="option-grid wrap">
              {GOALS.map((g) => (
                <button
                  key={g}
                  className={`option-btn ${form.goal === g ? "active" : ""}`}
                  onClick={() => setForm({ ...form, goal: g })}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Duration (minutes)</label>
            <div className="option-grid">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  className={`option-btn ${form.duration === d ? "active" : ""}`}
                  onClick={() => setForm({ ...form, duration: d })}
                >
                  {d} min
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Available Equipment</label>
            <div className="option-grid wrap">
              {EQUIPMENT.map((e) => (
                <button
                  key={e}
                  className={`option-btn ${form.equipment === e ? "active" : ""}`}
                  onClick={() => setForm({ ...form, equipment: e })}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <button
            className="generate-btn"
            onClick={generateWorkout}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner" /> Generating...</>
            ) : (
              "⚡ Generate My Workout"
            )}
          </button>
        </div>

        {/* Result */}
        <div className="workout-result-card">
          {loading && (
            <div className="loading-state">
              <div className="loading-icon">🏋️</div>
              <div className="loading-text">Building your personalized workout plan...</div>
              <div className="loading-sub">IBM Granite AI is crafting the perfect routine for you</div>
              <div className="loading-bar"><div className="loading-fill" /></div>
            </div>
          )}

          {error && !loading && (
            <div className="error-state">
              <div>⚠️ {error}</div>
            </div>
          )}

          {workout && !loading && (
            <div className="result-content">
              <div className="result-header">
                <div className="result-badge">✅ Your {form.duration}-Minute {form.goal} Plan</div>
                <div className="result-meta">{form.fitnessLevel} · {form.equipment}</div>
              </div>
              <div className="markdown workout-markdown">
                <ReactMarkdown>{workout}</ReactMarkdown>
              </div>
            </div>
          )}

          {!workout && !loading && !error && (
            <div className="empty-state">
              <div className="empty-icon">🎯</div>
              <div className="empty-title">Ready to Build Your Plan?</div>
              <p className="empty-sub">Configure your preferences and click <strong>"Generate My Workout"</strong> to get a custom routine from IBM Granite AI.</p>
              <div className="tip-cards">
                <div className="tip-card">💡 Home workouts can be as effective as gym sessions</div>
                <div className="tip-card">🔥 30 minutes of focused exercise beats 2 hours of distraction</div>
                <div className="tip-card">📈 Consistency is the #1 factor in fitness progress</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
