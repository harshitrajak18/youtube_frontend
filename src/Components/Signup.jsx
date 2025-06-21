import { useState } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom'

const BASE_URL = process.env.REACT_APP_BASE_URL;
export default function RegisterPage() {
    const navigate=useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleSendOTP = async () => {
    try {
      const res = await axios.post(`{BASE_URL}/email-request/`, { email });
      setMessage(res.data.message);
      
    } catch (err) {
      setMessage("Failed to send OTP");
    }
  };
  const handleRegister = async () => { 
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("otp", otp);
      formData.append("username", username);
      formData.append("password", password);
      if (profileImage) formData.append("profile_image", profileImage);
  
      const res = await axios.post(`{BASE_URL}/register/`, formData);
      setMessage(res.data.message);
      navigate('/login') 
    } catch (err) {
      if (err.response && err.response.data) {
        console.log("Registration error:", err.response.data); // 🔍 DEBUG LOG
        setMessage(JSON.stringify(err.response.data.errors || err.response.data));
      } else {
        setMessage("Registration failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-500 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-md shadow-2xl rounded-3xl p-8 w-full max-w-md text-white">
        <h2 className="text-3xl font-extrabold text-center mb-6">Sign up to PHOTO SHARE</h2>
        
        {message && (
          <p className="text-sm text-center mb-4 bg-white/20 rounded p-2">{message}</p>
        )}
        
        <div className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 rounded bg-white/20 placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            onClick={handleSendOTP}
            className="w-full bg-pink-600 hover:bg-pink-700 transition-colors text-white font-semibold py-2 rounded shadow"
          >
            Send OTP
          </button>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full px-4 py-2 rounded bg-white/20 placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
          />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-4 py-2 rounded bg-white/20 placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 rounded bg-white/20 placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
          />
          <input
            type="file"
            onChange={(e) => setProfileImage(e.target.files[0])}
            className="w-full text-white"
          />
          <button
            onClick={handleRegister}
            className="w-full bg-green-500 hover:bg-green-600 transition-colors text-white font-semibold py-2 rounded shadow"
          >
            Register
          </button>
        </div>

        <p className="mt-6 text-center text-sm">
          Already have an account? <a href="/login" className="text-blue-200 underline">Login</a>
        </p>
      </div>
    </div>
  );
}
