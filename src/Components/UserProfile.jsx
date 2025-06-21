import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import BASE_URL from "../baseUrl";
export default function UserProfile({ email }) {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false); // NEW STATE
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_file: null,
    thumbnail: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user-profile/${email}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setUser(res.data.user);
        setVideos(res.data.videos);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load user profile", err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [email]);

  const toggleModal = () => setShowModal(!showModal);

  const uploadVideo = async () => {
    setUploading(true); // START LOADING
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("video_file", formData.video_file);
    data.append("thumbnail", formData.thumbnail);
  
    try {
      const response = await axios.post(`${BASE_URL}/upload-video/${email}/`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data"
        }
      });
  
      alert("Upload successful");
      toggleModal();
      setFormData({ title: "", description: "", video_file: null, thumbnail: null });
      setVideos((prev) => [...prev, response.data]);
    } catch (err) {
      alert("Upload failed");
      console.error(err);
    } finally {
      setUploading(false); // END LOADING
    }
  };
  

  if (loading) {
    return <div className="text-center text-lg mt-10 text-gray-700">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center text-red-600 mt-10">User not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8">
        
      {/* LOADING OVERLAY */}
      {uploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center gap-2">
            <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-blue-700 font-medium">Uploading...</p>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        {/* Profile Section */}
        <div className="flex items-center gap-6 border-b pb-6">
          <img
            src={user.profile_photo}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-purple-500"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">{user.first_name} {user.last_name}</p>
          </div>
          <button
            onClick={toggleModal}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl ml-auto"
          >
            Upload new Video
          </button>
          <button 
          onClick={()=>navigate('/feed')}
          className="bg-red-400 hover:bg-red-700 text-white fond-bold py-2 px-4 rounded-xl ml-auto">
            Feed
          </button>
        </div>

        {/* Videos Section */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4 text-purple-700">Uploaded Videos</h3>
          {videos.length === 0 ? (
            <p className="text-gray-600">No videos uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video, index) => (
                <div key={index} className="bg-gray-50 rounded-xl shadow p-1">
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">{video.title}</h4>
                  <p className="text-gray-600 mb-2">{video.description}</p>
                  <video controls className="w-half h-48 rounded shadow mb-2">
                    <source src={video.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <p className="text-xs text-gray-500">Uploaded on: {video.uploaded_at}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
              onClick={toggleModal}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">Upload Video</h2>
            <input
              type="text"
              placeholder="Title"
              className="w-full mb-3 p-2 border rounded"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="w-full mb-3 p-2 border rounded"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <label className="block mb-2">Video File:</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFormData({ ...formData, video_file: e.target.files[0] })}
              className="mb-3"
            />
            <label className="block mb-2">Thumbnail:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files[0] })}
              className="mb-4"
            />
            <button
              onClick={uploadVideo}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
            >
              Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
