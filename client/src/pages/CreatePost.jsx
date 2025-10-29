// client/src/pages/CreatePost.jsx
import React, { useState, useContext } from "react";
import { postService } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in first.");

    setErrorMsg("");
    const fd = new FormData();
    fd.append("title", title);
    fd.append("content", content);
    if (image) fd.append("featuredImage", image);

    try {
      setLoading(true);
      const response = await postService.createPost(fd);

      console.log("✅ Server response:", response);

      // ✅ Adjusted check for the backend structure
      if (!response.success || !response.post?._id) {
        throw new Error("Invalid server response");
      }

      // Redirect to the post view page
      navigate(`/posts/${response.post._id}`);
    } catch (err) {
      console.error("Failed to create post:", err.response?.data || err);
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        "Error creating post";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a New Post</h2>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your content here..."
        required
        rows="6"
      />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button type="submit" disabled={loading}>
        {loading ? "Publishing..." : "Publish"}
      </button>
    </form>
  );
}
