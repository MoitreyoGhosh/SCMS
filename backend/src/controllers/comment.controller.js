import { Comment } from "../models/Comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// 💬 Create a new comment on an assignment
const createComment = asyncHandler(async (req, res) => {
  const { assignmentId, text } = req.body;

  const comment = new Comment({
    text,
    author: req.user._id, // Assuming req.user contains the logged-in user's data
    assignment: assignmentId,
  });

  await comment.save();

  res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment created successfully"));
});

// 💬 Get all comments for a specific assignment
const getCommentsByAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;

  const comments = await Comment.find({ assignment: assignmentId })
    .populate("author", "name email")
    .sort({ createdAt: -1 });

  if (!comments.length) {
    return res
      .status(404)
      .json(new ApiError(404, null, "No comments found for this assignment"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments retrieved successfully"));
});

// ✏️ Update a comment
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { text },
    { new: true }
  ).populate("author", "name email");

  if (!updatedComment) {
    return res
      .status(404)
      .json(new ApiError(404, null, "Comment not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

// 🗑️ Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const deletedComment = await Comment.findByIdAndDelete(commentId);

  if (!deletedComment) {
    return res
      .status(404)
      .json(new ApiError(404, null, "Comment not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});

export {
  createComment,
  getCommentsByAssignment,
  updateComment,
  deleteComment,
};
