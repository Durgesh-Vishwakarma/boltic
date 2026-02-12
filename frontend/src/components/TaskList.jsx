import { useEffect, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { deleteTask, fetchTasks } from "../services/api";
import TaskItem from "./TaskItem";
import { ListTodo, Clock, Loader2, CheckCircle2, Inbox } from "lucide-react";

export default function TaskList({ refresh }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      const message = err.message || "Failed to load tasks";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((prev) => prev + 1);
    }, 60000); // refresh every 1 minute

    return () => clearInterval(interval);
  }, 10000);

  useEffect(() => {
    loadTasks();
  }, [refresh]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "PENDING").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await deleteTask(id);
      toast.success("Task deleted");
      await loadTasks();
    } catch (err) {
      const message = err.message || "Failed to delete task";
      setError(message);
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <LoadingState>
        <Loader2 className="spin" size={24} />
      </LoadingState>
    );
  }

  return (
    <div>
      <ListHeader>
        <h3>Tasks ({filteredTasks.length})</h3>
        <FilterSelect
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Tasks</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </FilterSelect>
      </ListHeader>

      <TaskStats>
        <StatCard $variant="one">
          <StatHeader>
            <StatIcon>
              <ListTodo size={14} />
            </StatIcon>
            <StatTitle>Total</StatTitle>
          </StatHeader>
          <StatValue>{taskStats.total}</StatValue>
        </StatCard>
        <StatCard $variant="two">
          <StatHeader>
            <StatIcon>
              <Clock size={14} />
            </StatIcon>
            <StatTitle>Pending</StatTitle>
          </StatHeader>
          <StatValue>{taskStats.pending}</StatValue>
        </StatCard>
        <StatCard $variant="three">
          <StatHeader>
            <StatIcon>
              <Loader2 size={14} />
            </StatIcon>
            <StatTitle>In Progress</StatTitle>
          </StatHeader>
          <StatValue>{taskStats.inProgress}</StatValue>
        </StatCard>
        <StatCard $variant="four">
          <StatHeader>
            <StatIcon>
              <CheckCircle2 size={14} />
            </StatIcon>
            <StatTitle>Completed</StatTitle>
          </StatHeader>
          <StatValue>{taskStats.completed}</StatValue>
        </StatCard>
      </TaskStats>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {!error && filteredTasks.length === 0 && (
        <EmptyState>
          <EmptyIconWrap>
            <EmptyIcon />
          </EmptyIconWrap>
          <EmptyTitle>No tasks found</EmptyTitle>
          <EmptyText>Create your first task to get started!</EmptyText>
        </EmptyState>
      )}

      {filteredTasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onStatusChange={(id, status) =>
            setTasks((prev) =>
              prev.map((item) =>
                item._id === id ? { ...item, status } : item,
              ),
            )
          }
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

const LoadingState = styled.div`
  padding: 40px;
  text-align: center;
  color: var(--text-muted);
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  color: var(--text-main);
  background-color: #fff;
  cursor: pointer;
  outline: none;
  font-size: var(--text-sm);
`;

const TaskStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-2xl);
`;

const StatCard = styled.div`
  padding: 18px 16px;
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  background: ${({ $variant }) => {
    if ($variant === "one")
      return "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)";
    if ($variant === "two")
      return "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)";
    if ($variant === "three")
      return "linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)";
    if ($variant === "four")
      return "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)";
    return "linear-gradient(180deg, #ffffff 0%, #f9fbff 100%)";
  }};
  border-color: ${({ $variant }) => {
    if ($variant === "two") return "#fed7aa";
    if ($variant === "three") return "#a5f3fc";
    if ($variant === "four") return "#bbf7d0";
    return "rgba(148, 163, 184, 0.25)";
  }};
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
`;

const StatIcon = styled.div`
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 8px;
  color: var(--text-main);
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.2);
`;

const StatTitle = styled.h4`
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin: 0;
`;

const StatValue = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-main);
  line-height: 1;
`;

const ErrorMessage = styled.div`
  background: #fff1f2;
  color: #be123c;
  border: 1px solid #fecdd3;
  padding: 10px 12px;
  border-radius: 12px;
  margin-bottom: 14px;
  font-size: var(--text-sm);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 56px 24px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  border: 1px dashed var(--border);
  margin-top: 32px;
`;

const EmptyIconWrap = styled.div`
  display: flex;
  justify-content: center;
`;

const EmptyIcon = styled(Inbox).attrs({ size: 48, strokeWidth: 1 })`
  margin-bottom: var(--space-md);
  color: #9ca3af;
  display: block;
`;

const EmptyTitle = styled.h4`
  font-size: var(--text-lg);
  font-weight: 600;
  margin-bottom: var(--space-xs);
  color: var(--text-main);
`;

const EmptyText = styled.p`
  color: var(--text-muted);
  margin: 0;
`;
