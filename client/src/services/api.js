// api.js - Clean, stable API service

import axios from "axios";

// Ensure API URL exists
const baseURL = import.meta.env.VITE_API_URL;
if (!baseURL) {
  throw new Error("❌ Missing VITE_API_URL environment variable");
}

// Pure axios instance
const api = axios.create({
  baseURL: baseURL.replace(/\/+$/, ""), // remove trailing slash
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

//== POST SERVICE ==//
export const postService = {
  getAllPosts: async (page = 1, limit = 10, category = null) => {
    let url = `/posts?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    const res = await api.get(url);
    return res.data;
  },

  getPost: async (idOrSlug) => {
    const res = await api.get(`/posts/${idOrSlug}`);
    return res.data;
  },

  createPost: async (postData) => {
    const isForm = postData instanceof FormData;
    const headers = { "Content-Type": isForm ? "multipart/form-data" : "application/json" };
    const res = await api.post("/posts", postData, { headers });
    return res.data;
  },

  updatePost: async (id, postData) => {
    const res = await api.put(`/posts/${id}`, postData);
    return res.data;
  },

  deletePost: async (id) => {
    const res = await api.delete(`/posts/${id}`);
    return res.data;
  },

  addComment: async (postId, commentData) => {
    const res = await api.post(`/posts/${postId}/comments`, commentData);
    return res.data;
  },

  searchPosts: async (query) => {
    const res = await api.get(`/posts/search?q=${query}`);
    return res.data;
  },
};

//== CATEGORY SERVICE ==//
export const categoryService = {
  getAllCategories: async () => (await api.get("/categories")).data,

  createCategory: async (data) => (await api.post("/categories", data)).data,
};

//== AUTH SERVICE ==//
export const authService = {
  register: async (userData) => (await api.post("/auth/register", userData)).data,

  login: async (credentials) => {
    const res = await api.post("/auth/login", credentials);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  },
};

export default api;
