import React, { useState } from "react";
import "./Sidebar.css";

const navItems = [
  { id: "chat",      icon: "💬", label: "AI Chat Coach",   desc: "Chat with Fitness Buddy" },
  { id: "workout",   icon: "🏋️", label: "Workouts",        desc: "Custom workout plans" },
  { id: "nutrition", icon: "🥗", label: "Nutrition",       desc: "Meal ideas & nutrition" },
  { id: "habits",    icon: "📅", label: "Habit Tracker",   desc: "Build daily habits" },
];

const FITNESS_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const GOALS = ["Lose Weight", "Build Muscle", "Improve Endurance", "Stay Active", "Stress Relief", "General Fitness"];
const DIETS = ["None", "Vegetarian", "Vegan", "Keto", "Gluten-Free", "Dairy-Free"];

export default function Sidebar({ activePage, setActivePage, userProfile, setUserProfile }) {
  const [profileOpen, setProfileOpen] = useState(false);

  const handleProfile = (field, value) => {
    setUserProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">💪</div>
        <div>
          <div className="brand-name">Fitness Buddy</div>
          <div className="brand-sub">IBM Granite AI Coach</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? "active" : ""}`}
            onClick={() => setActivePage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">
              <span className="nav-label">{item.label}</span>
              <span className="nav-desc">{item.desc}</span>
            </span>
          </button>
        ))}
      </nav>

      {/* Profile Section */}
      <div className="sidebar-profile">
        <button className="profile-toggle" onClick={() => setProfileOpen(!profileOpen)}>
          <span>👤 My Profile</span>
          <span className={`chevron ${profileOpen ? "open" : ""}`}>▾</span>
        </button>

        {profileOpen && (
          <div className="profile-form">
            <div className="form-group">
              <label>Fitness Level</label>
              <div className="pill-group">
                {FITNESS_LEVELS.map((l) => (
                  <button
                    key={l}
                    className={`pill ${userProfile.fitnessLevel === l ? "active" : ""}`}
                    onClick={() => handleProfile("fitnessLevel", l)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Goal</label>
              <select
                value={userProfile.goal}
                onChange={(e) => handleProfile("goal", e.target.value)}
              >
                <option value="">Select goal...</option>
                {GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                placeholder="Your age"
                value={userProfile.age}
                onChange={(e) => handleProfile("age", e.target.value)}
                min="10" max="100"
              />
            </div>

            <div className="form-group">
              <label>Dietary Preference</label>
              <div className="pill-group wrap">
                {DIETS.map((d) => (
                  <button
                    key={d}
                    className={`pill ${userProfile.dietaryPreference === d ? "active" : ""}`}
                    onClick={() => handleProfile("dietaryPreference", d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* IBM Badge */}
      <div className="sidebar-footer">
        <div className="ibm-badge">
          <span className="ibm-dot"></span>
          <span>Powered by IBM Granite</span>
        </div>
        <div className="ibm-model">ibm/granite-3-8b-instruct</div>
      </div>
    </aside>
  );
}
