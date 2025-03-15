"use client";
import { useState } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

const TeacherAttendance = () => {
  const [qrCode, setQrCode] = useState(null);
  const [classId, setClassId] = useState("");

  const generateQRCode = async () => {
    try {
      const response = await axios.post(`/api/attendance/generate-qr/${classId}`);
      setQrCode(response.data.qrCode);
    } catch (error) {
      console.error("Error generating QR Code:", error);
    }
  };

  const exportCSV = () => {
    window.open(`/api/attendance/export/csv/${classId}`, "_blank");
  };

  const exportExcel = () => {
    window.open(`/api/attendance/export/excel/${classId}`, "_blank");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Teacher Attendance</h1>
      <input
        type="text"
        placeholder="Enter Class ID"
        value={classId}
        onChange={(e) => setClassId(e.target.value)}
        className="border p-2 m-2"
      />
      <button onClick={generateQRCode} className="bg-blue-500 text-white p-2 rounded">
        Generate QR Code
      </button>

      {qrCode && (
        <div className="mt-4">
          <QRCodeSVG value={qrCode} size={200} />
          <p className="mt-2">Scan this QR code to mark attendance</p>
        </div>
      )}

      <div className="mt-4">
        <button onClick={exportCSV} className="bg-green-500 text-white p-2 m-2 rounded">
          Export as CSV
        </button>
        <button onClick={exportExcel} className="bg-green-500 text-white p-2 m-2 rounded">
          Export as Excel
        </button>
      </div>
    </div>
  );
};

export default TeacherAttendance;
