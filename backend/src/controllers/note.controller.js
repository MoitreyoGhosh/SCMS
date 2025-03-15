import { Note } from "../models/Note.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cloudinary } from "../utils/cloudinary.js";

// Create a new note
const createNote = asyncHandler(async (req, res) => {
  const { title, content, class: classId } = req.body;
  let fileUrl = null;

  if (req.file) {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    fileUrl = result.secure_url;
  }

  const note = new Note({
    title,
    content,
    author: req.user._id, // Get the logged-in user's ID
    class: classId,
    fileUrl,
  });

  await note.save();

  res.status(201).json(new ApiResponse(201, note, "Note created successfully"));
});

// Get notes for a specific class
const getNotesByClass = asyncHandler(async (req, res) => {
  const { classId } = req.params;
  const notes = await Note.find({ class: classId }).populate(
    "author",
    "name email"
  );

  if (!notes || notes.length === 0) {
    // Check if notes exist for the given class ID
    return res
      .status(404)
      .json(new ApiResponse(404, null, "No notes found for this class"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes retrieved successfully"));
});

// Update a note
const updateNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const { title, content } = req.body;
  let fileUrl = req.body.fileUrl || null; // Preserve existing or get new

  if (req.file) {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    fileUrl = result.secure_url;
  }

  const updatedNote = await Note.findByIdAndUpdate(
    noteId,
    { title, content, fileUrl },
    { new: true }
  );

  if (!updatedNote) {
    return next(new ApiError(404, "Note not found"));
  }

  res.json(new ApiResponse(200, updatedNote, "Note updated successfully"));
});

// Delete a note
const deleteNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  const deletedNote = await Note.findByIdAndDelete(noteId);

  if (!deletedNote) {
    return res.status(404).json(new ApiResponse(404, null, "Note not found"));
  }

  res.json(new ApiResponse(200, null, "Note deleted successfully")); // 200 OK for successful deletion.  No content needed.
});

export { createNote, getNotesByClass, updateNote, deleteNote };
