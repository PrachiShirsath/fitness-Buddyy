import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import "./WorkoutPage.css";
import "./NutritionPage.css";

const MEAL_TYPES  = ["Breakfast", "Lunch", "Dinner", "Snack", "Pre-Workout", "Post-Workout"];
const DIETS       = ["None", "Vegetarian", "Vegan", "Keto", "Gluten-Free", "Dairy-Free", "High-Protein"];
const CALORIE_MAP = ["Low (under 400 cal)", "Moderate (400-600 cal)", "High (600+ cal)"];

const NUTRITION_FACTS = [
  { icon: "💧", title: "Hydration", fact: "Drink at least 8 glasses (2L) of water daily. More on workout days." },
  { icon: "🥦", title: "Vegetables", fact: "Aim for 5 servings of colorful vegetables per day for micronutrients." },
  { icon: "🥩", title: "Protein", fact: "Consume 0.8–1.6g of protein per kg of body weight for muscle repair." },
  { icon: "🌾", title: "Complex Carbs", fact: "Choose whole grains over refined carbs for sustained energy." },
  { icon: "🥑", title: "Healthy Fats", fact: "Include avocado, nuts, and olive oil — they support hormone health." },
  { icon: "⏰", title: "Meal Timing", fact: "Eat within 45 minutes post-workout to maximize muscle recovery." },
];

export default function NutritionPage({ userProfile }) {
  const [form, setForm] = useState({
    mealType:          "Breakfast",
    dietaryPreference: userProfile?.dietaryPreference || "None",
    calories:          "Moderate (400-600 cal)",
  });
  const [meals, setMeals]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const generateMeals = async () => {
    setLoading(true);
    setError("");
    setMeals(null);
    try {
      const { data } = await axios.post("/api/meal", {
        mealType:          form.mealType,
        dietaryPreference: form.dietaryPreference,
        calories:          form.calories,
      });
      setMeals(data.meals);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate meal suggestions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nutrition-page">
      <div className="page-header">
        <div className="page-header-icon">🥗</div>
        <div>
          <h1 className="page-title">Nutrition Planner</h1>
          <p className="page-sub">Discover healthy meal ideas tailored to your goals with IBM Granite AI</p>
        </div>
      </div>

      <div className="nutrition-layout">
        {/* Form */}
        <div className="nutrition-form-card">
          <h2 className="form-title">🍽️ Find Meal Ideas</h2>

          <div className="form-section">
            <label className="form-label">Meal Type</label>
            <div className="option-grid wrap">
              {MEAL_TYPES.map((m) => (
                <button
                  key={m}
                  className={`option-btn ${form.mealType === m ? "active" : ""}`}
                  onClick={() => setForm({ ...form, mealType: m })}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Dietary Preference</label>
            <div className="option-grid wrap">
              {DIETS.map((d) => (
                <button
                  key={d}
                  className={`option-btn ${form.dietaryPreference === d ? "active" : ""}`}
                  onClick={() => setForm({ ...form, dietaryPreference: d })}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Calorie Range</label>
            <div className="option-grid wrap">
              {CALORIE_MAP.map((c) => (
                <button
                  key={c}
                  className={`option-btn ${form.calories === c ? "active" : ""}`}
                  onClick={() => setForm({ ...form, calories: c })}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <button className="generate-btn" onClick={generateMeals} disabled={loading}>
            {loading ? (<><span className="spinner" /> Generating...</>) : "🥗 Get Meal Ideas"}
          </button>

          {/* Nutrition Facts */}
          <div className="nutrition-facts">
            <div className="facts-title">📚 Quick Nutrition Tips</div>
            {NUTRITION_FACTS.map((f, i) => (
              <div key={i} className="fact-item">
                <span className="fact-icon">{f.icon}</span>
                <div>
                  <div className="fact-name">{f.title}</div>
                  <div className="fact-text">{f.fact}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="nutrition-result-card">
          {loading && (
            <div className="loading-state">
              <div className="loading-icon">🥗</div>
              <div className="loading-text">Creating your personalized meal ideas...</div>
              <div className="loading-sub">IBM Granite AI is finding the best meals for you</div>
              <div className="loading-bar"><div className="loading-fill" /></div>
            </div>
          )}

          {error && !loading && (
            <div className="error-state">⚠️ {error}</div>
          )}

          {meals && !loading && (
            <div className="result-content">
              <div className="result-header">
                <div className="result-badge">✅ {form.mealType} Ideas · {form.dietaryPreference}</div>
                <div className="result-meta">{form.calories}</div>
              </div>
              <div className="markdown nutrition-markdown">
                <ReactMarkdown>{meals}</ReactMarkdown>
              </div>
            </div>
          )}

          {!meals && !loading && !error && (
            <div className="empty-state">
              <div className="empty-icon">🍽️</div>
              <div className="empty-title">Discover Nutritious Meals</div>
              <p className="empty-sub">Select your meal type and preferences, then click <strong>"Get Meal Ideas"</strong> for personalized suggestions.</p>
              <div className="tip-cards">
                <div className="tip-card">🥦 Whole foods over processed foods — always</div>
                <div className="tip-card">🍳 Meal prep Sunday = healthy week ahead</div>
                <div className="tip-card">🌈 Eat the rainbow — diverse colors = diverse nutrients</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
