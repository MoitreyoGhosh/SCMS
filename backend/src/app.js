import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(express.static("public"));

// Routes imports
import attendanceRoutes from "./routes/attendance.routes.js";
import noteRoutes from "./routes/note.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";

// API routes
app.use("/api/attendance", attendanceRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/assignments", assignmentRoutes);

export { app };
