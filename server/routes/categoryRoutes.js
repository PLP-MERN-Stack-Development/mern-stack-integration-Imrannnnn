import express from "express";
import { body } from "express-validator";
import { getCategories, createCategory } from "../controllers/categoryController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
router.get("/", getCategories);
router.post("/", auth, [ body("name").notEmpty().withMessage("Name required") ], createCategory);

export default router;
