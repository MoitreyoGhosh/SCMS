import { Stream } from "../models/Stream.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Create a New Stream (Admin Only)
export const createStream = asyncHandler(async (req, res, next) => {
  const { name, adminId } = req.body;

  if (!name || !adminId) {
    return next(new ApiError(400, "Stream name and Admin ID are required"));
  }

  const stream = await Stream.create({ name, admin: adminId });

  res
    .status(201)
    .json(new ApiResponse(201, stream, "Stream created successfully"));
});

//Assign Teacher to a Stream
export const assignTeacherToStream = asyncHandler(async (req, res, next) => {
  const { streamId, teacherId } = req.body;

  const stream = await Stream.findById(streamId);
  if (!stream) return next(new ApiError(404, "Stream not found"));

  if (!stream.teachers.includes(teacherId)) {
    stream.teachers.push(teacherId);
    await stream.save();
  }

  res
    .status(200)
    .json(new ApiResponse(200, stream, "Teacher assigned successfully"));
});

// Get All Streams
export const getAllStreams = asyncHandler(async (req, res) => {
  const streams = await Stream.find().populate("teachers", "name email");
  res
    .status(200)
    .json(new ApiResponse(200, streams, "Streams retrieved successfully"));
});
