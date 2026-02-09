const axios = require("axios");

exports.notifyTaskCompleted = async (task) => {
  try {
    await axios.post(process.env.BOLTIC_WEBHOOK_URL, {
      taskId: task._id,
      title: task.title,
      assigneeEmail: task.assigneeEmail,
      completedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Boltic webhook failed:", error.message);
  }
};
