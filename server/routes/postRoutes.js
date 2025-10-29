import express from "express";
import { body } from "express-validator";
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
} from "../controllers/postController.js";
import { auth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// 🟩 Get all posts
router.get("/", getPosts);

// 🟩 Get a single post by ID
router.get("/:id", getPost);

// 🟩 Create a new post
router.post(
  "/",
  auth,
  upload.single("featuredImage"),
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("content").trim().notEmpty().withMessage("Content is required"),
  ],
  createPost
);

// 🟩 Update a post
router.put(
  "/:id",
  auth,
  upload.single("featuredImage"),
  [
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
    body("content").optional().trim().notEmpty().withMessage("Content cannot be empty"),
  ],
  updatePost
);

// 🟩 Delete a post
router.delete("/:id", auth, deletePost);

// 🟩 Add a comment
router.post(
  "/:id/comments",
  auth,
  [body("text").trim().notEmpty().withMessage("Comment text is required")],
  addComment
);

export default router;
