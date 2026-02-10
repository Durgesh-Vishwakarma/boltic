import { useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";
import { ClipboardList } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="page">
      <div className="app-shell">
        <header className="app-header">
          <div className="header-content">
            <div className="app-icon">
              <ClipboardList size={20} strokeWidth={2.5} />
            </div>
            <div className="app-title">
              <h2>Automated Task Chaser</h2>
              <p className="subtitle">
                Create, assign, and track tasks in one place
              </p>
            </div>
          </div>
        </header>

        <main className="app-main">
          <TaskForm onTaskCreated={() => setRefresh(!refresh)} />
          <TaskList refresh={refresh} />
        </main>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable={false}
      />
    </div>
  );
}
