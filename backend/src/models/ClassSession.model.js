import mongoose from "mongoose";

const classSessionSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    streamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stream",
      required: true,
    },
    qrCode: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

classSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const ClassSession = mongoose.model("ClassSession", classSessionSchema);
