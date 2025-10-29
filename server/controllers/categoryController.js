import Category from "../models/Category.js";
import { validationResult } from "express-validator";

export const getCategories = async (req, res, next) => {
  try {
    const cats = await Category.find().sort("name");
    res.json(cats);
  } catch (err) { next(err); }
};

export const createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name } = req.body;
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: "Category exists" });

    const cat = await Category.create({ name });
    res.status(201).json(cat);
  } catch (err) { next(err); }
};
