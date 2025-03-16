import { Submission } from "../models/Submission.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cloudinary } from "../utils/cloudinary.js";

// 📝 Create a new submission
const createSubmission = asyncHandler(async (req, res) => {
  const { assignmentId, textSolution } = req.body;
  let fileSolutionUrl = null;

  if (req.file) {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    fileSolutionUrl = result.secure_url;
  }

  const submission = new Submission({
    assignment: assignmentId,
    student: req.user._id,
    textSolution,
    fileSolutionUrl,
  });

  await submission.save();

  res
    .status(201)
    .json(new ApiResponse(201, submission, "Submission created successfully"));
});

// 📂 Get all submissions for a specific assignment (Teacher only)
const getSubmissionsByAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;

  const submissions = await Submission.find({ assignment: assignmentId })
    .populate("student", "name email")
    .populate("assignment", "title")
    .sort({ createdAt: -1 });

  if (!submissions.length) {
    return res
      .status(404)
      .json(new ApiError(404, null, "No submissions found for this assignment"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, submissions, "Submissions retrieved successfully"));
});

// 📝 Get a specific submission by ID
const getSubmissionById = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;

  const submission = await Submission.findById(submissionId)
    .populate("student", "name email")
    .populate("assignment", "title");

  if (!submission) {
    return res
      .status(404)
      .json(new ApiError(404, null, "Submission not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, submission, "Submission retrieved successfully"));
});

// 🏅 Grade a submission (Teacher only)
const gradeSubmission = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;
  const { grade } = req.body;

  const updatedSubmission = await Submission.findByIdAndUpdate(
    submissionId,
    { grade },
    { new: true }
  ).populate("student", "username");

  if (!updatedSubmission) {
    return res
      .status(404)
      .json(new ApiError(404, null, "Submission not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedSubmission, "Submission graded successfully"));
});

// 🗑️ Delete a submission
const deleteSubmission = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;

  const deletedSubmission = await Submission.findByIdAndDelete(submissionId);

  if (!deletedSubmission) {
    return res
      .status(404)
      .json(new ApiError(404, null, "Submission not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Submission deleted successfully"));
});

export {
  createSubmission,
  getSubmissionsByAssignment,
  getSubmissionById,
  gradeSubmission,
  deleteSubmission,
};
