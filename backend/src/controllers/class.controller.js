import { Class } from "../models/Class.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Create a New Class (Only Admins & Teachers)
export const createClass = asyncHandler(async (req, res, next) => {
  try {
    const { name, streamId, creatorId } = req.body;

    if (!name || !streamId || !creatorId) {
      return next(
        new ApiError(400, "Class name, Stream ID, and Creator ID are required")
      );
    }

    // Verify the creator's role (Must be Admin or Teacher)
    const creator = await User.findById(creatorId);
    if (!creator) {
      return next(new ApiError(404, "User not found"));
    }
    if (creator.role !== "Admin" && creator.role !== "Teacher") {
      return next(
        new ApiError(403, "Only Admins and Teachers can create classes")
      );
    }

    // If Teacher is creating a class, check if they are assigned to the stream
    if (creator.role === "Teacher") {
      const stream = await Stream.findById(streamId);
      if (!stream) return next(new ApiError(404, "Stream not found"));

      if (!stream.teachers.includes(creatorId)) {
        return next(
          new ApiError(403, "Teacher is not assigned to this stream")
        );
      }
    }

    // Create class (Admins can create anywhere, Teachers only in assigned streams)
    const newClass = await Class.create({
      name,
      stream: streamId,
      teacher: creator.role === "Teacher" ? creatorId : null,
    });

    res
      .status(201)
      .json(new ApiResponse(201, newClass, "Class created successfully"));
  } catch (error) {
    console.log("Error creating class:", error);
    next(new ApiError(500, "Failed to create class", error));
  }
});

// Get All Classes for a Teacher or Admin
export const getClasses = asyncHandler(async (req, res, next) => {
  try {
    const { userId, role } = req.params; // Get user role (Admin/Teacher)

    let classes;
    if (role === "Admin") {
      classes = await Class.find()
        .populate("teacher", "name")
        .populate("students", "name studentId");
    } else if (role === "Teacher") {
      classes = await Class.find({ teacher: userId }).populate(
        "students",
        "name studentId"
      );
    } else {
      return next(new ApiError(403, "Unauthorized access"));
    }

    if (!classes.length) {
      return next(new ApiError(404, "No classes found"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, classes, "Classes retrieved successfully"));
  } catch (error) {
    console.log("Error retrieving classes:", error);
    next(new ApiError(500, "Failed to retrieve classes", error));
  }
});

// Add Student to a Class (Admin & Teacher)
export const addStudentToClass = asyncHandler(async (req, res, next) => {
  try {
    const { classId, studentId } = req.body;

    const classInstance = await Class.findById(classId);
    if (!classInstance) return next(new ApiError(404, "Class not found"));

    if (!classInstance.students.includes(studentId)) {
      classInstance.students.push(studentId);
      await classInstance.save();
    }

    res
      .status(200)
      .json(new ApiResponse(200, classInstance, "Student added successfully"));
  } catch (error) {
    console.log("Error adding student to class:", error);
    next(new ApiError(500, "Failed to add student to class", error));
  }
});
