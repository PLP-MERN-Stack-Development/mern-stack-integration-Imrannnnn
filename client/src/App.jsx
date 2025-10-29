import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx'; // ✅
import PostView from './components/PostView';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Login from './pages/Login';
import Register from './pages/Register';
import Nav from './components/Navbar';
import { AuthProvider } from "./context/AuthProvider.jsx";
import { AuthContext } from "./context/AuthContext.js";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <main style={{ padding: '1rem' }}>
          <Routes>
            <Route path="/" element={<Home />} /> {/* ✅ Home page */}
            <Route path="/posts/:id" element={<PostView />} />
            <Route
              path="/new"
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute>
                  <EditPost />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
