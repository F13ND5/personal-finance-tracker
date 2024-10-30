// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig.js'; 
import Navbar from './components/AppBar';
import Expenses from './pages/Expenses';
import Goals from './pages/Goals';
import Budgets from './pages/Budgets';
import UserProfile from './pages/UserProfile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

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

    return () => unsubscribe(); // Cleanup the subscription
  }, []);

  return (
    <Router>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<h1>Welcome to Personal Finance Tracker</h1>} />
          <Route path="/expenses" element={<Expenses userId={userId} />} />
          <Route path="/goals" element={<Goals userId={userId} />} />
          <Route path="/budgets" element={<Budgets userId={userId} />} />
          <Route path="/profile" element={<UserProfile userId={userId} />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
