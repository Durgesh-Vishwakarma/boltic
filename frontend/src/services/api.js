import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add response interceptor for better error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "An error occurred";
    return Promise.reject(new Error(message));
  },
);

export const fetchTasks = async () => {
  const res = await API.get("/tasks");
  return res.data.tasks;
};

export const createTask = async (data) => {
  const res = await API.post("/tasks", data);
  return res.data;
};

export const updateTaskStatus = async (id, status) => {
  const res = await API.patch(`/tasks/${id}/status`, { status });
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await API.delete(`/tasks/${id}`);
  return res.data;
};
