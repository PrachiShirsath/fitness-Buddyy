import React, { useState } from "react";
import ChatPage from "./pages/ChatPage";
import WorkoutPage from "./pages/WorkoutPage";
import NutritionPage from "./pages/NutritionPage";
import HabitsPage from "./pages/HabitsPage";
import Sidebar from "./components/Sidebar";
import "./App.css";

export default function App() {
  const [activePage, setActivePage] = useState("chat");
  const [userProfile, setUserProfile] = useState({
    fitnessLevel: "",
    goal: "",
    age: "",
    dietaryPreference: "",
  });

  const renderPage = () => {
    switch (activePage) {
      case "chat":
        return <ChatPage userProfile={userProfile} />;
      case "workout":
        return <WorkoutPage userProfile={userProfile} />;
      case "nutrition":
        return <NutritionPage userProfile={userProfile} />;
      case "habits":
        return <HabitsPage />;
      default:
        return <ChatPage userProfile={userProfile} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
      />
      <main className="app-main">{renderPage()}</main>
    </div>
  );
}
