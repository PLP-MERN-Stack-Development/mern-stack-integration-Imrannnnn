// client/src/pages/PostForm.jsx
import React, { useState, useContext } from 'react';
import { postService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function PostForm() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login');
    const fd = new FormData();
    fd.append('title', title);
    fd.append('content', content);
    if (image) fd.append('featuredImage', image);

    try {
      const res = await postService.createPost(fd);
      navigate(`/posts/${res.data._id || res.data._id}`);
    } catch (err) {
      console.error(err);
      alert('Error creating post');
    }
  };

  return (
    <form onSubmit={submit}>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Content" minLength={10} required />
      <input type="file" onChange={e=>setImage(e.target.files[0])} />
      <button type="submit">Publish</button>
    </form>
  );
}
