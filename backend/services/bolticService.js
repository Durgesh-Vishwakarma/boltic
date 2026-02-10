const axios = require("axios");

exports.notifyTaskCompleted = async (task) => {
  const url = process.env.BOLTIC_WEBHOOK_URL;
  if (!url) {
    console.warn("Boltic webhook URL is not configured");
    return;
  }

  try {
    await axios.post(url, {
      taskId: task._id,
      title: task.title,
      assigneeEmail: task.assigneeEmail,
      completedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Boltic webhook failed:", error.message);
  }
};
