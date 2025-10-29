// client/src/pages/Home.jsx
import React from "react";
import PostList from "../components/PostList";

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Blog</h1>
      <PostList />
    </div>
  );
}
