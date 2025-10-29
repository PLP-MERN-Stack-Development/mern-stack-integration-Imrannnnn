import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true }, // ✅ changed from "body" to "content"
    excerpt: String,
    featuredImage: String, // path/url to image
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
