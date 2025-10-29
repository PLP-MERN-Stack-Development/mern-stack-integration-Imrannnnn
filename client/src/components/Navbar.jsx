// client/src/components/Nav.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext.js";

export default function Nav() {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <Link to="/">Home</Link> |{' '}
      {user ? (
        <>
          <Link to="/new">New Post</Link> | <span>Hi, {user.name}</span> | <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
