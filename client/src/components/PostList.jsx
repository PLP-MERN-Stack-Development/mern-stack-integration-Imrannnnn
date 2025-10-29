// client/src/pages/PostList.jsx
import React, { useEffect, useState } from 'react';
import useApi from '../hooks/useApi';
import { postService } from '../services/api';
import PostCard from '../components/PostCard';

export default function PostList() {
  const { call, loading, error } = useApi();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await call(() => postService.getAllPosts(page, limit));
        console.log('📦 Full API response:', res);

        const data = res?.data || res;
        const postsData = data?.posts || data?.data || [];
        const total = data?.totalPages || 1;

        console.log('🧩 Normalized posts:', postsData);
        setPosts(postsData);
        setTotalPages(total);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setPosts([]);
      }
    };

    fetchPosts();
  }, [call, page, limit]);

  const handleDelete = async (id) => {
    const prev = posts;
    setPosts(posts.filter((p) => p._id !== id));

    try {
      await postService.deletePost(id);
    } catch (err) {
      console.error('Delete failed:', err);
      setPosts(prev);
      alert('Delete failed');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', margin: '1rem 0' }}>Posts</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error.message || 'Error'}</p>}
      {!loading && posts.length === 0 && <p>No posts found.</p>}

      {posts.map((p) => (
        <PostCard key={p._id} post={p} onDelete={handleDelete} />
      ))}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
