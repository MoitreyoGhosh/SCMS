import express from "express";
import {
  createStream,
  assignTeacherToStream,
  getAllStreams,
} from "../controllers/stream.controller.js";

const router = express.Router();

// Admin creates Stream
router.post("/create", createStream);

// Admin assigns teacher
router.post("/assign-teacher", assignTeacherToStream);

// Fetch all Streams
router.get("/all", getAllStreams);

export default router;
