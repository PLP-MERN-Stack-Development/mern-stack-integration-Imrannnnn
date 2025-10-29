import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { postService } from '../services/api';

export default function PostView() {
  const { id } = useParams();
  const { call, loading } = useApi();
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (id) {
      call(() => postService.getPost(id))
        .then(setPost)
        .catch(console.error);
    }
  }, [id, call]);

  if (loading || !post) return <p>Loading...</p>;

  return (
    <article>
      <h1>{post.title}</h1>
      {post.featuredImage && (
        <img
          src={post.featuredImage}
          alt={post.title}
          style={{ maxWidth: '100%' }}
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <section>
        <h4>Comments</h4>
        {post.comments?.length ? (
          post.comments.map((c, idx) => (
            <div key={idx}>
              <b>{c.user?.name || 'User'}</b>
              <p>{c.content}</p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </section>
    </article>
  );
}
