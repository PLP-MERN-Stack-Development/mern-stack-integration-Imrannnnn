// server/controllers/postController.js
import Post from "../models/Post.js";
import { validationResult } from "express-validator";

// 🟩 Get all posts (with pagination)
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const total = await Post.countDocuments();
    const posts = await Post.find()
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 🟩 Get single post by ID
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name");
    if (!post)
      return res.status(404).json({ success: false, message: "Post not found" });

    res.status(200).json({ success: true, post });
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 🟩 Create new post
export const createPost = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, content } = req.body; // ✅ must match frontend field names
    const featuredImage = req.file ? `/uploads/${req.file.filename}` : null;

    const post = new Post({
      title,
      content,
      featuredImage,
      author: req.user.id, // ✅ set by auth middleware
    });

    const savedPost = await post.save();

    res.status(201).json({
      success: true,
      post: savedPost,
      message: "Post created successfully",
    });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 🟩 Update a post
export const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const updateData = { title, content };

    if (req.file) {
      updateData.featuredImage = `/uploads/${req.file.filename}`;
    }

    const post = await Post.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!post)
      return res.status(404).json({ success: false, message: "Post not found" });

    res.status(200).json({
      success: true,
      post,
      message: "Post updated successfully",
    });
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 🟩 Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post)
      return res.status(404).json({ success: false, message: "Post not found" });

    res.status(200).json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 🟩 Add a comment (placeholder)
export const addComment = async (req, res) => {
  try {
    res.status(501).json({ message: "addComment not implemented yet" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
