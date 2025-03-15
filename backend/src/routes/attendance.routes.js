import express from "express";
import {
  exportAttendanceCSV,
  exportAttendanceExcel,
  generateQRCode,
  getAttendance,
  markAttendance,
} from "../controllers/attendance.controller.js";

const router = express.Router();

// routes
router.post("/generate-qr-code/:classId", generateQRCode);
router.post("/mark", markAttendance);
router.get("/class/:classId", getAttendance);
router.get("/export/csv/:classId", exportAttendanceCSV);
router.get("/export/excel/:classId", exportAttendanceExcel);

export default router;
