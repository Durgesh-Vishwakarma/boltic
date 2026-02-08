import { useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

export default function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="container">
      <h2>Automated Chaser Agent</h2>
      <TaskForm onTaskCreated={() => setRefresh(!refresh)} />
      <TaskList refresh={refresh} />
    </div>
  );
}
