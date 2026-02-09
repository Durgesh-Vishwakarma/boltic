import axios from "axios";

const API = axios.create({
   baseURL: import.meta.env.VITE_API_BASE_URL
});

export const fetchTasks = async () => {
  const res = await API.get("/tasks");
  return res.data.tasks;
};

export const createTask = async (data) => {
  return API.post("/tasks", data);
};

export const updateTaskStatus = async (id, status) => {
  return API.patch(`/tasks/${id}/status`, { status });
};
