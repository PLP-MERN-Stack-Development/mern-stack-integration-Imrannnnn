import express from "express";
import { body } from "express-validator";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password min 6")
], register);

router.post("/login", login);

export default router;
