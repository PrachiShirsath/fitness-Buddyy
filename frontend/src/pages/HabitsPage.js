import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HabitsPage.css";

const DEFAULT_HABITS = [
  { id: 1, name: "Morning workout",          icon: "🏋️", target: 7, completed: [], category: "exercise" },
  { id: 2, name: "Drink 8 glasses of water", icon: "💧", target: 7, completed: [], category: "hydration" },
  { id: 3, name: "Eat a healthy breakfast",  icon: "🥗", target: 7, completed: [], category: "nutrition" },
  { id: 4, name: "7+ hours of sleep",        icon: "😴", target: 7, completed: [], category: "recovery" },
  { id: 5, name: "10-min meditation",        icon: "🧘", target: 7, completed: [], category: "mindfulness" },
  { id: 6, name: "No junk food today",       icon: "🚫", target: 7, completed: [], category: "nutrition" },
];

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function getWeekKeys() {
  const keys = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    keys.push(d.toISOString().split("T")[0]);
  }
  return keys;
}

export default function HabitsPage() {
  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem("fitness_habits");
      return saved ? JSON.parse(saved) : DEFAULT_HABITS;
    } catch { return DEFAULT_HABITS; }
  });
  const [motivation, setMotivation] = useState("");
  const [motLoading, setMotLoading]  = useState(false);
  const [newHabit, setNewHabit]     = useState("");
  const [streak, setStreak]         = useState(0);

  const weekKeys = getWeekKeys();
  const todayKey = getTodayKey();

  useEffect(() => {
    localStorage.setItem("fitness_habits", JSON.stringify(habits));
    // Calculate current streak
    let s = 0;
    for (let i = weekKeys.length - 1; i >= 0; i--) {
      const key = weekKeys[i];
      const allDone = habits.every((h) => h.completed.includes(key));
      if (allDone) s++;
      else break;
    }
    setStreak(s);
  }, [habits]);

  const toggleHabit = (habitId) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId
          ? {
              ...h,
              completed: h.completed.includes(todayKey)
                ? h.completed.filter((d) => d !== todayKey)
                : [...h.completed, todayKey],
            }
          : h
      )
    );
  };

  const addHabit = () => {
    const name = newHabit.trim();
    if (!name) return;
    const habit = {
      id: Date.now(),
      name,
      icon: "⭐",
      target: 7,
      completed: [],
      category: "custom",
    };
    setHabits((prev) => [...prev, habit]);
    setNewHabit("");
  };

  const removeHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const fetchMotivation = async () => {
    setMotLoading(true);
    try {
      const { data } = await axios.get("/api/motivation");
      setMotivation(data.motivation);
    } catch {
      setMotivation("You have the power to change your life one habit at a time. Keep going! 💪");
    } finally {
      setMotLoading(false);
    }
  };

  useEffect(() => { fetchMotivation(); }, []);

  const todayCompleted = habits.filter((h) => h.completed.includes(todayKey)).length;
  const completionPct  = habits.length ? Math.round((todayCompleted / habits.length) * 100) : 0;

  return (
    <div className="habits-page">
      <div className="page-header">
        <div className="page-header-icon">📅</div>
        <div>
          <h1 className="page-title">Habit Tracker</h1>
          <p className="page-sub">Build consistency — track your daily health habits</p>
        </div>
      </div>

      <div className="habits-content">
        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value">{todayCompleted}/{habits.length}</div>
            <div className="stat-label">Today's Habits</div>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${completionPct}%` }} />
            </div>
            <div className="stat-pct">{completionPct}% complete</div>
          </div>
          <div className="stat-card accent">
            <div className="stat-value">🔥 {streak}</div>
            <div className="stat-label">Day Streak</div>
            <div className="stat-sub">Keep it going!</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">📅 7</div>
            <div className="stat-label">Days Tracked</div>
            <div className="stat-sub">This week</div>
          </div>
        </div>

        {/* Motivation Card */}
        <div className="motivation-card">
          <div className="motivation-header">
            <div className="motivation-title">⚡ Daily Motivation · IBM Granite AI</div>
            <button className="refresh-btn" onClick={fetchMotivation} disabled={motLoading}>
              {motLoading ? "⏳" : "🔄"} Refresh
            </button>
          </div>
          <div className="motivation-text">
            {motLoading ? (
              <span className="mot-loading">Fetching your daily motivation...</span>
            ) : (
              motivation || "Click Refresh to get your daily motivational tip!"
            )}
          </div>
        </div>

        <div className="habits-grid">
          {/* Habit Tracker */}
          <div className="habits-tracker">
            <div className="tracker-header">
              <h2 className="tracker-title">📋 This Week's Habits</h2>
              <div className="week-labels">
                {WEEK_DAYS.map((d) => <span key={d} className="week-day">{d}</span>)}
              </div>
            </div>

            <div className="habits-list">
              {habits.map((habit) => {
                const doneToday = habit.completed.includes(todayKey);
                const weekCount = weekKeys.filter((k) => habit.completed.includes(k)).length;
                return (
                  <div key={habit.id} className={`habit-row ${doneToday ? "done" : ""}`}>
                    <button
                      className="habit-check"
                      onClick={() => toggleHabit(habit.id)}
                      title={doneToday ? "Mark incomplete" : "Mark complete"}
                    >
                      {doneToday ? "✅" : "⬜"}
                    </button>
                    <div className="habit-icon">{habit.icon}</div>
                    <div className="habit-info">
                      <div className="habit-name">{habit.name}</div>
                      <div className="habit-week-count">{weekCount}/7 this week</div>
                    </div>
                    <div className="habit-dots">
                      {weekKeys.map((key, i) => (
                        <div
                          key={i}
                          className={`habit-dot ${habit.completed.includes(key) ? "filled" : ""} ${key === todayKey ? "today" : ""}`}
                          title={WEEK_DAYS[i]}
                        />
                      ))}
                    </div>
                    <button className="remove-habit" onClick={() => removeHabit(habit.id)} title="Remove habit">✕</button>
                  </div>
                );
              })}
            </div>

            {/* Add Habit */}
            <div className="add-habit-row">
              <input
                className="add-habit-input"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                placeholder="Add a new habit..."
                onKeyDown={(e) => e.key === "Enter" && addHabit()}
              />
              <button className="add-habit-btn" onClick={addHabit} disabled={!newHabit.trim()}>
                + Add
              </button>
            </div>
          </div>

          {/* Tips Panel */}
          <div className="habit-tips-panel">
            <h2 className="tips-title">💡 Habit Building Science</h2>

            <div className="tip-blocks">
              <div className="tip-block">
                <div className="tip-block-icon">🔁</div>
                <div className="tip-block-title">The 21-Day Rule</div>
                <p>It takes approximately 21–66 days to form a new habit. Start small, stay consistent, and celebrate every day you show up.</p>
              </div>
              <div className="tip-block">
                <div className="tip-block-icon">⚓</div>
                <div className="tip-block-title">Habit Stacking</div>
                <p>Attach a new habit to an existing one. Example: "After I brush my teeth, I will do 10 push-ups." This creates a powerful trigger.</p>
              </div>
              <div className="tip-block">
                <div className="tip-block-icon">🏆</div>
                <div className="tip-block-title">Never Miss Twice</div>
                <p>Missing once is normal. Missing twice is the start of a new (bad) habit. The key rule: <strong>never miss twice in a row</strong>.</p>
              </div>
              <div className="tip-block">
                <div className="tip-block-icon">📉</div>
                <div className="tip-block-title">Make it Easy</div>
                <p>Reduce friction. Lay out your workout clothes the night before. Prep meals on Sunday. Lower the barrier to doing the right thing.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
