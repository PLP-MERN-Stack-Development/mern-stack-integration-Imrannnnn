// client/src/pages/Home.jsx
import React from "react";
import PostList from "../components/PostList";

export default function Home() {
  return (
    <div>
      <header
        style={{
          padding: "3rem 1rem",
          background: "linear-gradient(135deg, #1f2937 0%, #0f172a 100%)",
          color: "white",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2.25rem", margin: 0 }}>MERN Blog</h1>
        <p style={{ marginTop: "0.75rem", color: "#cbd5e1" }}>
          Insights, tutorials, and stories from our developer community
        </p>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h2 style={{ margin: 0 }}>Latest posts</h2>
        </div>
        <PostList />
      </main>
    </div>
  );
}
