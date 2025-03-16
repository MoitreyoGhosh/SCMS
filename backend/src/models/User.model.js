import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Teacher", "Student"],
      required: true,
    },
    stream: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stream",
    }, // For Teachers & Students
    classes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ], // For Students & Teachers
    studentId: {
      type: String,
      unique: true,
      required: function () {
        return this.role === "Student";
      },
    }, // Admin assigns this
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);