import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from "./Components/Login";
import LandingPage from "./Components/Landing";
import RegisterPage from "./Components/Signup";
import UserProfile from "./Components/UserProfile";
import Feed from "./Components/Feed";
import VideoDetail from "./Components/VideoDetails";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <div>
      <Routes>
        {/* 👇 Make / route point to Feed */}
        <Route path="/" element={<Feed />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<RegisterPage />} />

        {/* Protected User Profile */}
        <Route
          path="/user-profile"
          element={
            <PrivateRoute>
              <UserProfile email={localStorage.getItem('email')} />
            </PrivateRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/feed" element={<Feed />} />
        <Route path="/video/:id" element={<VideoDetail />} />
      </Routes>
    </div>
  );
}

export default App;
