// import fs from "fs";
// import path from "path";
import { stringify } from "csv-stringify";
import XLSX from "xlsx";
import { ClassSession } from "../models/classSession.model.js";
import { Attendance } from "../models/Attendance.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Generate QR String (Includes classSessionId, classId, and streamId)
const generateQRString = (classSessionId, classId, streamId) =>
  `${classSessionId}|${classId}|${streamId}|${Date.now()}`;

export const generateQRCode = asyncHandler(async (req, res, next) => {
  const { classId, streamId } = req.params;

  if (!classId || !streamId) {
    return next(new ApiError(400, "classId and streamId are required"));
  }

  // Create a new class session
  const expiresAt = new Date(Date.now() + 60 * 1000); // 1-minute expiry
  const newSession = await ClassSession.create({
    classId,
    streamId,
    expiresAt,
    startTime: new Date(),
  });

  // Generate QR code with classSessionId, classId, and streamId
  const qrCode = generateQRString(newSession._id, classId, streamId);
  newSession.qrCode = qrCode;
  await newSession.save();

  return res
    .status(201)
    .json(new ApiResponse(201, { qrCode, expiresAt }, "QR code generated"));
});

// Mark Attendance (Extract classSessionId, classId, and streamId from QR Code)
export const markAttendance = asyncHandler(async (req, res, next) => {
  const { qrCode, studentId } = req.body;

  if (!qrCode || !studentId) {
    return next(new ApiError(400, "QR Code and student ID are required"));
  }

  // Extract classSessionId, classId, and streamId from QR Code
  const [classSessionId, classId, streamId] = qrCode.split("|");
  if (!classSessionId || !classId || !streamId) {
    return next(new ApiError(400, "Invalid QR Code format"));
  }

  // Validate classSession
  const classSession = await ClassSession.findById(classSessionId);
  if (!classSession) return next(new ApiError(404, "Class session not found"));

  if (classSession.classId !== classId || classSession.streamId !== streamId) {
    return next(new ApiError(400, "QR Code mismatch"));
  }

  if (classSession.expiresAt < new Date()) {
    return next(new ApiError(400, "QR code expired"));
  }

  const existingAttendance = await Attendance.findOne({
    student: studentId,
    classSession: classSessionId,
  });

  if (existingAttendance) {
    return next(new ApiError(400, "Attendance already marked"));
  }

  // Mark as "Pending"
  const newAttendance = await Attendance.create({
    student: studentId,
    classSession: classSessionId,
    classId,
    streamId,
    status: "Pending",
  });

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { attendanceId: newAttendance._id },
        "Attendance marked"
      )
    );

  // Auto-update status after 1 minute
  setTimeout(async () => {
    const attendanceRecord = await Attendance.findById(newAttendance._id);
    if (attendanceRecord && attendanceRecord.status === "Pending") {
      attendanceRecord.status = "Present"; // Student stayed on the page
      await attendanceRecord.save();
    }
  }, 60 * 1000);
});

// Get Attendance
export const getAttendance = asyncHandler(async (req, res, next) => {
  try {
    const { classId, streamId } = req.params;

    if (!classId || !streamId) {
      return next(new ApiError(400, "classId and streamId are required"));
    }

    // Find all class sessions for the given class and stream
    const classSessions = await ClassSession.find({ classId, streamId }).select(
      "_id"
    );

    if (!classSessions.length) {
      return next(
        new ApiError(404, "No attendance records found for this class")
      );
    }

    // Extract class session IDs
    const sessionIds = classSessions.map((session) => session._id);

    // Fetch all attendance records linked to these class sessions
    const attendanceRecords = await Attendance.find({
      classSession: { $in: sessionIds },
    })
      .populate("student", "name email") // Get student name & email
      .populate("classSession", "classId streamId startTime"); // Get session start time

    if (!attendanceRecords.length) {
      return next(
        new ApiError(404, "No attendance records found for this class")
      );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          attendanceRecords,
          "Attendance records fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error getting attendance:", error);
    return next(new ApiError(500, "Failed to get attendance"));
  }
});

// Export attendance as CSV
export const exportAttendanceCSV = asyncHandler(async (req, res, next) => {
  try {
    const { classId, streamId } = req.params;

    if (!classId || !streamId) {
      return next(new ApiError(400, "classId and streamId are required"));
    }

    // Find all class sessions
    const classSessions = await ClassSession.find({ classId, streamId }).select(
      "_id"
    );

    if (!classSessions.length) {
      return next(
        new ApiError(404, "No attendance records found for this class")
      );
    }

    const sessionIds = classSessions.map((session) => session._id);

    // Fetch attendance records
    const attendanceRecords = await Attendance.find({
      classSession: { $in: sessionIds },
    })
      .populate("student", "name email")
      .populate("classSession", "classId streamId startTime");

    if (!attendanceRecords.length) {
      return next(
        new ApiError(404, "No attendance records available for export")
      );
    }

    // Format data for CSV
    const csvData = attendanceRecords.map((record) => ({
      Student_ID: record.student._id,
      Student_Name: record.student.name,
      Student_Email: record.student.email,
      Session_Start: record.classSession.startTime.toISOString(),
      Attendance_Status: record.status,
    }));

    // Convert to CSV format
    stringify(csvData, { header: true }, (err, output) => {
      if (err) {
        return next(new ApiError(500, "Failed to export attendance as CSV"));
      }

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=attendance.csv${Date.now()}.csv`
      );
      res.status(200).send(output);
    });
  } catch (error) {
    console.error("Error exporting attendance as CSV:", error);
    return next(new ApiError(500, "Failed to export attendance as CSV"));
  }
});

// Export attendance as Excel
export const exportAttendanceExcel = asyncHandler(async (req, res, next) => {
  try {
    const { classId, streamId } = req.params;

    if (!classId || !streamId) {
      return next(new ApiError(400, "classId and streamId are required"));
    }

    const classSessions = await ClassSession.find({ classId, streamId }).select(
      "_id"
    );

    if (!classSessions.length) {
      return next(
        new ApiError(404, "No attendance records found for this class")
      );
    }

    const sessionIds = classSessions.map((session) => session._id);

    const attendanceRecords = await Attendance.find({
      classSession: { $in: sessionIds },
    })
      .populate("student", "name email")
      .populate("classSession", "classId streamId startTime");

    if (!attendanceRecords.length) {
      return next(new ApiError(404, "No attendance data available for export"));
    }

    // Format data for Excel
    const excelData = attendanceRecords.map((record) => ({
      Student_ID: record.student._id,
      Student_Name: record.student.name,
      Student_Email: record.student.email,
      Session_Start: record.classSession.startTime.toISOString(),
      Attendance_Status: record.status,
    }));

    // Create a new workbook and add a worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    // Generate Excel buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=attendance.xlsx${Date.now()}.xlsx`
    );
    res.status(200).send(buffer);
  } catch (error) {
    console.error("Error exporting attendance as Excel:", error);
    return next(new ApiError(500, "Failed to export attendance as Excel"));
  }
});
