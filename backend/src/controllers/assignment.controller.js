import { Assignment } from "../models/Assignment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cloudinary } from "../utils/cloudinary.js";

// 📚 Create a new assignment
const createAssignment = asyncHandler(async (req, res) => {
  const { title, description, dueDate, class: classId } = req.body;
  let assignmentFileUrl = null;

  if (req.file) {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    assignmentFileUrl = result.secure_url;
  }

  const assignment = new Assignment({
    title,
    description,
    dueDate,
    author: req.user._id, // Get the logged-in user's ID
    class: classId,
    assignmentFileUrl,
  });

  await assignment.save();

  res
    .status(201)
    .json(new ApiResponse(201, assignment, "Assignment created successfully"));
});

// 📝 Get all assignments for a specific class
const getAssignmentsByClass = asyncHandler(async (req, res) => {
  const { classId } = req.params;

  const assignments = await Assignment.find({ class: classId })
    .populate("author", "username")
    .sort({ createdAt: -1 }); // Sort by newest first

  if (!assignments.length) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "No assignments found for this class"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, assignments, "Assignments retrieved successfully"));
});

// 📝 Get a specific assignment by ID
const getAssignmentById = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;

  const assignment = await Assignment.findById(assignmentId).populate(
    "author",
    "username"
  );

  if (!assignment) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Assignment not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, assignment, "Assignment retrieved successfully"));
});

// ✏️ Update an assignment
const updateAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const { title, description, dueDate } = req.body;
  let assignmentFileUrl = req.body.assignmentFileUrl || null;

  if (req.file) {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    assignmentFileUrl = result.secure_url;
  }

  const updatedAssignment = await Assignment.findByIdAndUpdate(
    assignmentId,
    { title, description, dueDate, assignmentFileUrl },
    { new: true }
  ).populate("author", "username");

  if (!updatedAssignment) {
    return res
      .status(404)
      .json(new ApiError(404, "Assignment not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedAssignment, "Assignment updated successfully"));
});

// 🗑️ Delete an assignment
const deleteAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;

  const deletedAssignment = await Assignment.findByIdAndDelete(assignmentId);

  if (!deletedAssignment) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Assignment not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Assignment deleted successfully"));
});

export {
  createAssignment,
  getAssignmentsByClass,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
};
