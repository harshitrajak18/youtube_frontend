import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL, LOCAL_HOST } from "../baseUrl";

export default function UserProfile({ email }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);

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
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setUser(res.data.user);
        setVideos(res.data.videos);
      } catch (err) {
        console.error("Failed to load user profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [email]);

  const toggleModal = () => setShowModal(!showModal);

  const uploadVideo = async () => {
    setUploading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("video_file", formData.video_file);
    data.append("thumbnail", formData.thumbnail);

    try {
      const response = await axios.post(
        `${BASE_URL}/upload-video/${email}/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Upload successful");
      toggleModal();
      setFormData({
        title: "",
        description: "",
        video_file: null,
        thumbnail: null,
      });
      setVideos((prev) => [...prev, response.data]);
    } catch (err) {
      alert("Upload failed");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-lg mt-10 text-rose-600">Loading...</div>
    );
  }
  if (!user) {
    return (
      <div className="text-center text-red-600 mt-10">User not found</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-rose-50 to-purple-100 p-6 sm:p-10">
      {/* Uploading Loader */}
      {uploading && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="animate-spin h-8 w-8 border-t-2 border-rose-500 rounded-full mx-auto mb-4"></div>
            <p className="text-rose-600 font-semibold">Uploading...</p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-white/30 backdrop-blur-lg rounded-2xl p-6 sm:p-10 shadow-lg border border-rose-200">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b pb-6 border-rose-300">
          <img
            src={user.profile_photo}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-rose-500 shadow-md object-cover"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-rose-800">
              {user.username}
            </h2>
            <p className="text-rose-600">{user.email}</p>
            <p className="text-sm text-rose-500">
              {user.first_name} {user.last_name}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={toggleModal}
              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg shadow transition"
            >
              + Upload Video
            </button>
            <button
              onClick={() => navigate("/feed")}
              className="bg-purple-200 hover:bg-purple-300 text-purple-800 px-4 py-2 rounded-lg transition"
            >
              View Feed
            </button>
          </div>
        </div>

        {/* Videos */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-rose-700 mb-4">
            Your Videos
          </h3>
          {videos.length === 0 ? (
            <p className="text-rose-600">
              You haven't uploaded any videos yet.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow-md p-4 border border-rose-100"
                >
                  <h4 className="text-md font-semibold text-rose-800 mb-1">
                    {video.title}
                  </h4>
                  <p className="text-sm text-rose-600 mb-2">
                    {video.description}
                  </p>
                  <video
                    controls
                    className="w-full h-48 object-cover rounded mb-2 ring-1 ring-rose-200"
                    src={video.video_url}
                  />
                  <p className="text-xs text-rose-500">
                    Uploaded: {new Date(video.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg border border-rose-200">
            <button
              onClick={toggleModal}
              className="absolute top-4 right-4 text-rose-500 hover:text-rose-700 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4 text-rose-800 text-center">
              Upload New Video
            </h2>
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 mb-3 border rounded-lg focus:ring-rose-500 focus:border-rose-500"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              className="w-full p-2 mb-3 border rounded-lg focus:ring-rose-500 focus:border-rose-500"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <label className="block text-sm font-medium mb-1 text-rose-700">
              Video File
            </label>
            <input
              type="file"
              accept="video/*"
              className="mb-3 w-full text-sm text-rose-600"
              onChange={(e) =>
                setFormData({ ...formData, video_file: e.target.files[0] })
              }
            />
            <label className="block text-sm font-medium mb-1 text-rose-700">
              Thumbnail
            </label>
            <input
              type="file"
              accept="image/*"
              className="mb-4 w-full text-sm text-rose-600"
              onChange={(e) =>
                setFormData({ ...formData, thumbnail: e.target.files[0] })
              }
            />
            <button
              onClick={uploadVideo}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-lg shadow transition"
            >
              Upload Video
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
