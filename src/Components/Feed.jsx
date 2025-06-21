import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoDetail from "./VideoDetails";
import { useNavigate, useNavigation } from "react-router-dom";
const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Feed() {
  const navigate=useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`{BASE_URL}/feed/`);
        setVideos(res.data.videos);
      } catch (err) {
        console.error("Failed to fetch videos", err);
      } finally {
        setLoading(false);
      }
    }; 
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-600 text-lg">Loading videos...</div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-600 text-lg">No videos available.</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Recommended</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="cursor-pointer">
            <div className="relative pb-[56.25%] overflow-hidden rounded-lg shadow-lg bg-gray-200">
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="absolute top-0 left-0 w-full h-full object-cover"
                onClick={()=>navigate(`/video/${video.id}`)}
              />
            </div>
            <div className="mt-3 flex gap-3">
              <img
                src={video.uploaded_by.profile_image || "https://via.placeholder.com/40"}
                alt={video.uploaded_by.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-600">{video.uploaded_by.username}</p>
                <p className="text-xs text-gray-500">
                  {new Date(video.uploaded_at).toLocaleDateString()} • {video.views} views
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
