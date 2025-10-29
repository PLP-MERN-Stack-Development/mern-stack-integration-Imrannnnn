
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { postService } from "../services/api";
import { AuthContext } from "../context/AuthContext.js";


export default function EditPost() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postService.getPost(id);
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        console.error("Failed to load post:", err);
      }
    };
    fetchPost();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in.");

    const fd = new FormData();
    fd.append("title", title);
    fd.append("content", content);
    if (image) fd.append("featuredImage", image);

    try {
      setLoading(true);
      await postService.updatePost(id, fd);
      navigate(`/posts/${id}`);
    } catch (err) {
      console.error("Failed to update post:", err);
      alert("Error updating post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <h2>Edit Post</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Edit your content..."
        required
        rows="6"
      />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Post"}
      </button>
    </form>
  );
}
