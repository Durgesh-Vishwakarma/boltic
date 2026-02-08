import { updateTaskStatus } from "../services/api";

export default function TaskItem({ task, onStatusChange }) {
  const handleChange = async (e) => {
    await updateTaskStatus(task._id, e.target.value);
    onStatusChange();
  };

  return (
    <div className="task">
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <p>Assignee: {task.assigneeEmail}</p>
      <p>Due: {new Date(task.dueDate).toLocaleString()}</p>

      <select value={task.status} onChange={handleChange}>
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
      </select>
    </div>
  );
}
