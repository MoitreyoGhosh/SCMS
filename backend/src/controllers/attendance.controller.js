// import fs from "fs";
// import path from "path";
import { stringify } from "csv-stringify";
import XLSX from "xlsx";
import { ClassSession } from "../models/classSession.model.js";
import { Attendance } from "../models/Attendance.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Generate QR Code (Valid for 1 Minute)
const generateQRString = (classId) => `${classId}-${Date.now()}`;
export const generateQRCode = asyncHandler(async (req, res, next) => {
  const { classId } = req.params;

  // Check if an active session already exists
  const existingSession = await ClassSession.findOne({
    classId,
    expiresAt: { $gt: new Date() }, // Ensure it's not expired
  });

  if (existingSession) {
    return next(
      new ApiError(400, "An active session already exists for this class")
    );
  }

  // Generate unique QR code
  const qrCode = generateQRString(classId);
  const expiresAt = new Date(Date.now() + 60 * 1000); // 1 min expiry

  // Create and save new class session
  const newSession = await ClassSession.create({ classId, qrCode, expiresAt });

  // Return response using ApiResponse
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { qrCode, expiresAt },
        "QR code generated successfully"
      )
    );
});

// Mark Attendance
export const markAttendance = asyncHandler(async (req, res, next) => {
  try {
    const { classSessionId, studentId } = req.body;

    if (!classSessionId || !studentId) {
      return next(
        new ApiError(400, "Class session ID and student ID are required")
      );
    }

    const classSession = await ClassSession.findById(classSessionId);
    if (!classSession) {
      return next(new ApiError(404, "Class session not found"));
    }

    if (classSession.expiresAt < new Date()) {
      return next(new ApiError(400, "QR code has expired"));
    }

    // Check if student already marked attendance
    const existingAttendance = await Attendance.findOne({
      student: studentId,
      classSession: classSessionId,
    });
    if (existingAttendance) {
      return next(
        new ApiError(400, "Attendance already marked for this session")
      );
    }

    // Mark as "Pending"
    const newAttendance = await Attendance.create({
      student: studentId,
      classSession: classSessionId,
      status: "Pending",
    });

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { attendanceId: newAttendance._id },
          "Attendance marked as pending"
        )
      );

    // Auto-update status after 1 minute
    setTimeout(async () => {
      const attendanceRecord = await Attendance.findById(newAttendance._id);
      if (attendanceRecord && attendanceRecord.status === "Pending") {
        attendanceRecord.status = "Present"; // Student stayed on the page
        await attendanceRecord.save();
      }
    }, 60 * 1000); // 1 minute timer
  } catch (error) {
    console.log("Error marking attendance:", error);
    throw new ApiError(500, "Failed to mark attendance", error);
  }
});

// Get Attendance
export const getAttendance = asyncHandler(async (req, res, next) => {
  try {
    const { classId } = req.params;

    //Find all class sessions for the given class
    const classSessions = await ClassSession.find({ classId }).select("_id");

    if (!classSessions.length) {
      return next(
        new ApiError(404, "No attendance record found for the this class")
      );
    }

    //Extract class session ids
    const sessionIds = classSessions.map((session) => session._id);

    //Find all attendance records for the given class session ids
    const attendanceRecords = await Attendance.find({
      classSession: { $in: sessionIds },
    })
      .populate("student", "name email")
      .populate("classSession", "classId");

    if (!attendanceRecords.length) {
      return next(
        new ApiError(404, "No attendance record found for the this class")
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
    console.log("Error getting attendance:", error);
    throw new ApiError(500, "Failed to get attendance", error);
  }
});

//Export Attendance as CSV
export const exportAttendanceCSV = asyncHandler(async (req, res, next) => {
  try {
    const { classId } = req.params;

    //Find all class sessions for the given class
    const classSessions = await ClassSession.find({ classId }).select("_id");

    if (!classSessions.length) {
      return next(
        new ApiError(404, "No attendance record found for the this class")
      );
    }

    //Extract class session ids
    const sessionIds = classSessions.map((session) => session._id);

    //Fetch attendance records for the given class session ids
    const attendanceRecords = await Attendance.find({
      classSession: { $in: sessionIds },
    })
      .populate("student", "name email")
      .populate("classSession", "classId");

    if (!attendanceRecords.length) {
      return next(
        new ApiError(404, "No attendance record found for the this class")
      );
    }

    //Format data for CSV
    const csvData = attendanceRecords.map((record) => ({
      Student_Name: record.student.name,
      Student_Email: record.student.email,
      Session_Start: record.classSession.startTime.toISOString(),
      Attendance_Status: record.status,
    }));

    //Convert attendance records to CSV format
    stringify(csvData, { header: true }, (err, output) => {
      if (err) {
        return next(new ApiError(500, "Failed to export attendance", err));
      }

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=attendance.csv"
      );
      res.status(200).send(output);
    });
  } catch (error) {
    console.log("Error exporting attendance in CSV:", error);
    throw new ApiError(500, "Failed to export attendance in CSV", error);
  }
});

//Export Attendance as Excel
export const exportAttendanceExcel = asyncHandler(async (req, res, next) => {
  try {
    const { classId } = req.params;

    const classSessions = await ClassSession.find({ classId }).select("_id");

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
      .populate("classSession", "startTime");

    if (!attendanceRecords.length) {
      return next(new ApiError(404, "No attendance data available for export"));
    }

    // Format data for Excel
    const excelData = attendanceRecords.map((record) => ({
      Student_Name: record.student.name,
      Student_Email: record.student.email,
      Session_Start: record.classSession.startTime.toISOString(),
      Attendance_Status: record.status,
    }));

    //create a new workbook and add a worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    //Generate buffer
    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=attendance.xlsx"
    );
    res.status(200).send(buffer);
  } catch (error) {
    console.log("Error exporting attendance in Excel:", error);
    throw new ApiError(500, "Failed to export attendance in Excel", error);
  }
});
