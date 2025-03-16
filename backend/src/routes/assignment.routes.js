import express from "express";

import {
  createAssignment,
  getAssignmentsByClass,
  updateAssignment,
  deleteAssignment,
  getAssignmentById,
} from "../controllers/assignment.controller.js";

import {
  createSubmission,
  getSubmissionsByAssignment,
  gradeSubmission,
} from "../controllers/submission.controller.js";

import {
  createComment,
  getCommentsByAssignment,
} from "../controllers/comment.controller.js";



const router = express.Router();

/* =======================
       Assignment Routes
======================= */

// 📝 Create a new assignment
router.post("/", createAssignment);

// 📚 Get all assignments for a specific class
router.get("/class/:classId", getAssignmentsByClass);

// 📝 Get a specific assignment by ID
router.get("/:assignmentId", getAssignmentById);

// ✏️ Update an assignment
router.put("/:assignmentId", updateAssignment);

// 🗑️ Delete an assignment
router.delete("/:assignmentId", deleteAssignment);

/* =======================
       Submission Routes
======================= */

// 📤 Submit an assignment (text or file)
router.post("/:assignmentId/submissions", createSubmission);

// 📑 Get all submissions for an assignment (Teacher only)
router.get("/:assignmentId/submissions", getSubmissionsByAssignment);

// 🏷️ Grade a submission (Teacher only)
router.put("/submissions/:submissionId/grade", gradeSubmission);

/* =======================
        Comment Routes
======================= */

// 💬 Create a comment on an assignment
router.post("/:assignmentId/comments", createComment);

// 📝 Get all comments for an assignment
router.get("/:assignmentId/comments", getCommentsByAssignment);

export default router;
