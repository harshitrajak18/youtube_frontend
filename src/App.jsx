import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from "./Components/Login";
import LandingPage from "./Components/Landing";
import RegisterPage from "./Components/Signup";
import UserProfile from "./Components/UserProfile";
import Feed from "./Components/Feed";
import VideoDetail from "./Components/VideoDetails";

const userEmail = localStorage.getItem('email');


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/login" />;
};

function App(){

  return(
    <div>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<RegisterPage/>}/>
        
        <Route
        path="/user-profile"
        element={
          <PrivateRoute>
            <UserProfile email={userEmail}/>
          </PrivateRoute>
        }
      />
      <Route path='/feed' element={<Feed/>}/>
      <Route path='/video/:id' element={<VideoDetail/>}/>
        
      </Routes>
      

    </div>
  )

};

export  default App;