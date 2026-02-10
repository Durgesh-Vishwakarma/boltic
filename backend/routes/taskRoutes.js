const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

router.post("/tasks", createTask);
router.get("/tasks", getTasks);
router.patch("/tasks/:id/status", updateTaskStatus);
router.delete("/tasks/:id", deleteTask);

module.exports = router;
