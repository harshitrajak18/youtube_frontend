import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL  } from "../baseUrl";

export default function VideoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/videos/${id}/`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });
        setVideo(res.data);
      } catch (err) {
        console.error("Failed to fetch video details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id, token]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/videos/${id}/comments/`);
        setComments(res.data.comments || []);
      } catch (err) {
        console.error("Failed to fetch comments", err);
        setComments([]);
      }
    };
    fetchComments();
  }, [id]);

  const toggleLike = async () => {
    if (!token) {
      alert("You must be logged in to like a video.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/videos/${id}/like-toggle/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVideo((prev) => ({
        ...prev,
        likes: res.data.likes,
        liked: res.data.liked,
      }));
    } catch (err) {
      console.error("Error toggling like", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login");
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("You must be logged in to comment.");
      navigate("/login");
      return;
    }
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `${BASE_URL}/videos/${id}/comments/`,
        { text: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([res.data.comment, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  if (loading) return <div className="text-center mt-10 text-white">Loading video...</div>;
  if (!video) return <div className="text-center mt-10 text-white">Video not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-white">
      {/* Video Player */}
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
        <video
          src={video.video_url}
          controls
          className="w-full h-full rounded-md border border-gray-700"
        />
      </div>

      {/* Title and Meta */}
      <div className="mt-4 space-y-1">
        <h2 className="text-2xl font-bold">{video.title}</h2>
        <p className="text-sm text-gray-400">
          Uploaded by <span className="text-blue-400">{video.uploaded_by.username}</span> on{" "}
          {new Date(video.uploaded_at).toLocaleDateString()}
        </p>
      </div>

      <p className="mt-3 text-gray-300">{video.description}</p>

      {/* Like Button */}
      <div className="mt-5 flex items-center">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition 
            ${video.liked ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"}`}
        >
          <span className="text-white">{video.liked ? "❤️ Liked" : "🤍 Like"}</span>
          <span className="text-white">({video.likes})</span>
        </button>
      </div>

      {/* Comments */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-3">Comments</h3>

        {token && (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <textarea
              className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:outline-none"
              rows="3"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment..."
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded shadow"
            >
              Post Comment
            </button>
          </form>
        )}

        <div className="space-y-4">
          {Array.isArray(comments) && comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded shadow">
                <p className="font-semibold text-blue-300">{comment.user}</p>
                <p className="text-white mt-1">{comment.text}</p>
                <p className="text-sm text-gray-500 mt-1">{comment.created_at}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet. Be the first to add one!</p>
          )}
        </div>
      </div>
    </div>
  );
}
