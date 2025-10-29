// client/src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { authService } from "../services/api";
import { AuthProvider } from "../context/AuthProvider.jsx";
import { AuthContext } from "../context/AuthContext.js"
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await authService.login({ email, password });
      login(res.user, res.token);
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      <p>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </form>
  );
}
