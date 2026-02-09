const Task = require("../models/Task");
const { notifyTaskCompleted } = require("../services/bolticService");


exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ message: "Task created", task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getTasks = async (req, res) => {
  try {
    const { status, overdue } = req.query;
    let query = {};

    if (status) query.status = status;

    if (overdue === "true") {
      query.dueDate = { $lt: new Date() };
      query.status = { $ne: "COMPLETED" };
    }

    const tasks = await Task.find(query).sort({ dueDate: 1 });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

  
    if (status === "COMPLETED") {
      await notifyTaskCompleted(task);
    }

    res.json({ message: "Status updated", task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
