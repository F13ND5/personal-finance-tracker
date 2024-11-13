// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  auth,
  messaging,
  requestNotificationPermission,
} from "./firebaseConfig.js";
import { onMessage } from "firebase/messaging";
import Navbar from "./components/AppBar";
import Expenses from "./pages/Expenses";
import Goals from "./pages/Goals";
import Budgets from "./pages/Budgets";
import UserProfile from "./pages/UserProfile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import EducationalResources from "./pages/EducationalResources";
import Chatbot from "./components/Chatbot";
import Calculators from "./components/Calculators.js";

const App = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Set the user ID when authenticated
      } else {
        setUserId(null); // Clear the user ID when not authenticated
      }
    });

    // Request permission for notifications
    requestNotificationPermission();

    // Handle foreground messages
    const unsubscribeOnMessage = onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
      const { title, body } = payload.notification;
      new Notification(title, { body });
    });

    return () => {
      unsubscribe();
      unsubscribeOnMessage();
    };
  }, []);

  return (
    <Router>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Dashboard userId={userId} />} />
          <Route path="/expenses" element={<Expenses userId={userId} />} />
          <Route path="/goals" element={<Goals userId={userId} />} />
          <Route path="/budgets" element={<Budgets userId={userId} />} />
          <Route path="/profile" element={<UserProfile userId={userId} />} />
          <Route path="/calculator" element={<Calculators />} />
          <Route
            path="/resources"
            element={<EducationalResources userId={userId} />}
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
        <Chatbot />
      </div>
    </Router>
  );
};

export default App;
