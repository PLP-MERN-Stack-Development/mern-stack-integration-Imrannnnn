// client/src/components/PostCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function PostCard({ post, onDelete }) {
  return (
    <article
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
      }}
    >
      {post.featuredImage && (
        <img
          src={post.featuredImage}
          alt={post.title}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '6px'
          }}
        />
      )}
      <Link to={`/posts/${post._id}`}>
        <h3 style={{ marginTop: '0.8rem' }}>{post.title}</h3>
      </Link>
      <small style={{ color: '#555' }}>
        By {post.author?.name || 'Unknown'} |{' '}
        {new Date(post.createdAt).toLocaleDateString()}
      </small>
      <p style={{ marginTop: '0.5rem' }}>
        {post.excerpt || post.content?.slice(0, 120) + '...'}
      </p>

      {onDelete && (
        <button
          onClick={() => onDelete(post._id)}
          style={{
            marginTop: '0.5rem',
            backgroundColor: '#e63946',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '0.4rem 0.8rem',
            cursor: 'pointer'
          }}
        >
          Delete
        </button>
      )}
    </article>
  );
}
