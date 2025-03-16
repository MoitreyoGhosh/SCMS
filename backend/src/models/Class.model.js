import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  stream: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stream",
    required: true,
  }, // Linked to Stream
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Assigned teacher
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ], // Enrolled students
});

export const Class = mongoose.model("Class", classSchema);
