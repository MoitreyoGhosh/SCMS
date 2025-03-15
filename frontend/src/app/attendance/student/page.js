"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";

const StudentAttendance = ({ studentId }) => {
  const [attendanceId, setAttendanceId] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });

    scanner.render(
      async (decodedText) => {
        try {
          const response = await axios.post("/api/attendance/mark", {
            classSessionId: decodedText,
            studentId,
          });
          setAttendanceId(response.data.attendanceId);
          scanner.clear();
        } catch (error) {
          console.error("Error marking attendance:", error);
        }
      },
      (error) => console.error("QR Scan Error:", error)
    );

    return () => scanner.clear();
  }, [studentId]);

  // Track if the student navigates away (mark as absent)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden && attendanceId) {
        try {
          await axios.post("/api/attendance/mark", {
            attendanceId,
            status: "Absent",
          });
        } catch (error) {
          console.error("Error marking absent:", error);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [attendanceId]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Student Attendance</h1>
      <div id="reader" />
    </div>
  );
};

export default StudentAttendance;
