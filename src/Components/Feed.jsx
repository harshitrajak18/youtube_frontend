import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LOCAL_HOST, BASE_URL } from "../baseUrl";

export default function Feed() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchVideos = async (query = "") => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/videos/`, {
        params: query ? { search: query } : {},
      });
      setVideos(res.data.videos);
    } catch (err) {
      console.error("Failed to fetch videos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVideos(searchQuery);
  };

  const isAuthenticated = !!localStorage.getItem("accessToken");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Video Share</h1>

        {!isAuthenticated && (
          <div className="space-x-4">
            <button
              onClick={() => navigate("/signup")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              Login
            </button>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex mb-6 gap-4 items-center">
        <input
          type="text"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          Search
        </button>
      </form>

      {/* Video Feed */}
      {loading ? (
        <div className="text-center mt-20 text-gray-400 text-lg">Loading videos...</div>
      ) : videos.length === 0 ? (
        <div className="text-center mt-20 text-gray-400 text-lg">No videos found.</div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => navigate(`/video/${video.id}`)}
            >
              <div className="relative aspect-video bg-gray-700">
                <img
                  src={video.thumbnail_url || "https://via.placeholder.com/300x200.png?text=No+Thumbnail"}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex gap-3 p-4">
                <img
                  src={video.uploaded_by.profile_photo || "https://via.placeholder.com/40"}
                  alt={video.uploaded_by.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <h3 className="text-white font-semibold text-sm line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-xs text-gray-400">{video.uploaded_by.username}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(video.uploaded_at).toLocaleDateString()} • {video.views || 0} views
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
