import express from "express";
import {
  createClass,
  getClasses,
  addStudentToClass,
} from "../controllers/class.controller.js";

const router = express.Router();

// Admins & Teachers can create classes
router.post("/create", createClass);

// Fetch classes for Admin or Teacher
router.get("/:userId/:role", getClasses);

// Admins & Teachers add students
router.post("/add-student", addStudentToClass);

export default router;
