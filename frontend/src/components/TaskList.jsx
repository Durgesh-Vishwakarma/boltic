import { useEffect, useState } from "react";
import { fetchTasks } from "../services/api";
import TaskItem from "./TaskItem";

export default function TaskList({ refresh }) {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    const data = await fetchTasks();
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, [refresh]);

  return (
    <div>
      <h3>Tasks</h3>
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} onStatusChange={loadTasks} />
      ))}
    </div>
  );
}
