import mongoose from "mongoose";

const streamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ], // Assigned teachers
  },
  {
    timestamps: true,
  }
);

export const Stream = mongoose.model("Stream", streamSchema);
