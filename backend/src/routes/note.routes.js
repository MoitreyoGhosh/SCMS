import express from "express";
import { upload } from "../middlewares/multer.js";
import {
  createNote,
  getNotesByClass,
  updateNote,
  deleteNote,
} from "../controllers/note.controller.js";

const router = express.Router();

// Create a new note
router.post("/", upload.single("file"), createNote);

// Get notes for a specific class
router.get("/:classId", getNotesByClass);

// Update a note
router.put("/:noteId", upload.single("file"), updateNote);

// Delete a note
router.delete("/:noteId", deleteNote);

export default router;
