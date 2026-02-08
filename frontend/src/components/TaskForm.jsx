import { useState } from "react";
import { createTask } from "../services/api";

export default function TaskForm({ onTaskCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    assigneeEmail: "",
    dueDate: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTask(form);
    setForm({ title: "", description: "", assigneeEmail: "", dueDate: "" });
    onTaskCreated();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Task</h3>

      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input name="assigneeEmail" placeholder="Assignee Email" value={form.assigneeEmail} onChange={handleChange} required />
      <input type="datetime-local" name="dueDate" value={form.dueDate} onChange={handleChange} required />

      <button type="submit">Create</button>
    </form>
  );
}
