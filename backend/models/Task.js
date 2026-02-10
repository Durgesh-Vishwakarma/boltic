const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    assigneeEmail: {
      type: String,
      required: [true, "Assignee email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "Due date must be in the future",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "IN_PROGRESS", "COMPLETED"],
        message: "{VALUE} is not a valid status",
      },
      default: "PENDING",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual field to check if task is overdue
taskSchema.virtual("isOverdue").get(function () {
  return this.dueDate < new Date() && this.status !== "COMPLETED";
});

// Index for better query performance
taskSchema.index({ status: 1, dueDate: 1 });
taskSchema.index({ assigneeEmail: 1 });

module.exports = mongoose.model("Task", taskSchema);
