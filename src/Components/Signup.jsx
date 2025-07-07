import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { BASE_URL, LOCAL_HOST } from "../baseUrl";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleSendOTP = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/email-request/`, { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Failed to send OTP. Please try again.");
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

      const res = await axios.post(`${BASE_URL}/register/`, formData);
      setMessage(res.data.message);
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data) {
        console.log("Registration error:", err.response.data);
        setMessage(
          JSON.stringify(err.response.data.errors || err.response.data)
        );
      } else {
        setMessage("Registration failed.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-white space-y-6 animate-fade-in">
        <h2 className="text-3xl font-extrabold text-center">Create Your Account</h2>

        {message && (
          <div className="text-sm text-center bg-white/20 p-3 rounded shadow">
            {message}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full px-4 py-2 rounded bg-white/20 placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>
          <button
            onClick={handleSendOTP}
            className="w-full bg-pink-600 hover:bg-pink-700 transition text-white font-semibold py-2 rounded-lg shadow"
          >
            Send OTP
          </button>

          <div>
            <label className="text-sm font-medium">OTP</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP"
              className="mt-1 w-full px-4 py-2 rounded bg-white/20 placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              className="mt-1 w-full px-4 py-2 rounded bg-white/20 placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              className="mt-1 w-full px-4 py-2 rounded bg-white/20 placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files[0])}
              className="mt-1 w-full text-white"
            />
          </div>

          <button
            onClick={handleRegister}
            className="w-full bg-green-500 hover:bg-green-600 transition text-white font-semibold py-2 rounded-lg shadow"
          >
            Register
          </button>
        </div>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-200 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
