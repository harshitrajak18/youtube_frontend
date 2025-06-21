import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center justify-center p-8">
      <div className="bg-white shadow-2xl rounded-2xl max-w-4xl w-full overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Video Share</h1>
          <p className="text-gray-600 mb-6 text-lg">
            Discover the next generation of beautiful and responsive websites. 
            Designed to impress, built to perform.
          </p>
          <div className="space-x-4">
            <button  onClick={()=>navigate("/SignUp")}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">Sign Up </button>
            <button onClick={()=>navigate("/Login")}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition">Log in </button>
          </div>
        </div>
        <div className="bg-cover bg-center h-64 md:h-auto" style={{ backgroundImage: "url('https://unsplash.com/photos/red-and-white-square-illustration-niUkImZcSP8')" }}></div>
      </div>
    </div>
  );
}
