const Task = require("../models/Task");
const { notifyTaskCompleted } = require("../services/bolticService");


exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: errors.join(", "),
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to create task",
    });
  }
};


exports.getTasks = async (req, res) => {
  try {
    const { status, overdue, assigneeEmail } = req.query;
    let query = {};

    if (status) {
      if (!["PENDING", "IN_PROGRESS", "COMPLETED"].includes(status)) {
        return res.status(400).json({
          success: false,
          error: "Invalid status value",
        });
      }
      query.status = status;
    }

    if (assigneeEmail) {
      query.assigneeEmail = assigneeEmail.toLowerCase();
    }

    if (overdue === "true") {
      query.dueDate = { $lt: new Date() };
      query.status = { $ne: "COMPLETED" };
    }

    const tasks = await Task.find(query)
      .sort({ dueDate: 1, createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve tasks",
    });
  }
};


exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!["PENDING", "IN_PROGRESS", "COMPLETED"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status value",
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Send notification when task is completed
    if (status === "COMPLETED") {
      await notifyTaskCompleted(task);
    }

    res.json({
      success: true,
      message: "Status updated successfully",
      task,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid task ID",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to update task status",
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid task ID",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to delete task",
    });
  }
};
