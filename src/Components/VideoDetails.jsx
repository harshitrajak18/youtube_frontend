import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VideoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const token = localStorage.getItem("accessToken");

  // Fetch video details
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`{BASE_URL}/videos/${id}/`, {
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

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`{BASE_URL}/videos/${id}/comments/`);
        setComments(res.data.comments || []);
      } catch (err) {
        console.error("Failed to fetch comments", err);
        setComments([]);
      }
    };
    fetchComments();
  }, [id]);

  // Toggle Like
  const toggleLike = async () => {
    if (!token) {
      alert("You must be logged in to like a video.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        `{BASE_URL}/videos/${id}/like-toggle/`,
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

  // Submit new comment
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
        `{BASE_URL}/videos/${id}/comments/`,
        { text: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([res.data.comment, ...comments]); // Add new comment to top
      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading video...</div>;
  if (!video) return <div className="text-center mt-10">Video not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      {/* Video Player */}
      <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
        <video src={video.video_url} controls className="w-full h-full" />
      </div>

      <h2 className="text-2xl font-bold mt-4">{video.title}</h2>
      <p className="text-sm text-gray-400">
        Uploaded by {video.uploaded_by.username} on{" "}
        {new Date(video.uploaded_at).toLocaleDateString()}
      </p>

      <p className="mt-2 text-gray-300">{video.description}</p>

      {/* Like Button */}
      <div className="mt-4">
        <button
          onClick={toggleLike}
          className={`group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 focus:outline-none
            ${video.liked ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"}`}
        >
          <div className="w-5 h-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full transition-all duration-300"
              fill={video.liked ? "white" : "none"}
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 19.071l6.879-6.879 6.879 6.879M12 3v15"
              />
            </svg>
          </div>
          <span className="text-white font-medium transition-all duration-200 group-hover:scale-105">
            {video.liked ? "Liked" : "Like"} ({video.likes})
          </span>
        </button>
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Comments</h3>

        {/* Add Comment Form */}
        {token && (
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <textarea
              className="w-full p-2 rounded bg-gray-800 text-white"
              rows="3"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
            >
              Post Comment
            </button>
          </form>
        )}

        {/* List of Comments */}
        <div className="space-y-4">
          {Array.isArray(comments) && comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="bg-gray-800 p-3 rounded">
                <p className="font-semibold">{comment.user}</p>
                <p>{comment.text}</p>
                <p className="text-sm text-gray-400">{comment.created_at}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
