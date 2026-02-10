import { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { updateTaskStatus } from "../services/api";
import { Calendar, User, Trash2 } from "lucide-react";

export default function TaskItem({ task, onStatusChange, onDelete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isOverdue = (dueDate, status) => {
    return new Date(dueDate) < new Date() && status !== "COMPLETED";
  };

  const handleChange = async (e) => {
    const nextStatus = e.target.value;
    setLoading(true);
    setError("");
    try {
      await updateTaskStatus(task._id, nextStatus);
      onStatusChange(task._id, nextStatus);
      toast.success("Status updated");
    } catch (err) {
      const message = err.message || "Failed to update status";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || loading) return;
    const confirmed = window.confirm("Delete task?");
    if (!confirmed) return;

    setLoading(true);
    setError("");
    try {
      await onDelete(task._id);
    } catch (err) {
      const message = err.message || "Failed to delete task";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "PENDING":
        return "pending";
      case "IN_PROGRESS":
        return "inProgress";
      case "COMPLETED":
        return "completed";
      default:
        return "default";
    }
  };

  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <Card $overdue={overdue}>
      <Body>
        <Head>
          <Title>{task.title}</Title>
          <StatusBadge $variant={getStatusVariant(task.status)}>
            {task.status.replace("_", " ")}
          </StatusBadge>
        </Head>

        <Description>{task.description}</Description>

        <Meta>
          <MetaItem>
            <User size={14} />
            {task.assigneeEmail.split("@")[0]}
          </MetaItem>
          <MetaDate $overdue={overdue}>
            <Calendar size={14} />
            {new Date(task.dueDate).toLocaleDateString()}
            {overdue && " (Overdue)"}
          </MetaDate>
        </Meta>
      </Body>

      <Footer>
        <ActionsRow>
          <StatusSelect
            value={task.status}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </StatusSelect>

          <DeleteButton
            onClick={handleDelete}
            title="Delete Task"
            disabled={loading}
          >
            <Trash2 size={18} />
          </DeleteButton>
        </ActionsRow>
      </Footer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Card>
  );
}

const Card = styled.div`
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 18px 20px;
  margin-bottom: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-left: ${({ $overdue }) => ($overdue ? "4px solid #ef4444" : "")};
  background: ${({ $overdue }) => ($overdue ? "#fff6f6" : "#ffffff")};
`;

const Body = styled.div`
  padding-bottom: 8px;
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
`;

const Title = styled.h3`
  font-size: var(--text-base);
  font-weight: 600;
  margin-bottom: 4px;
`;

const Description = styled.p`
  font-size: var(--text-sm);
  margin-bottom: var(--space-md);
`;

const Meta = styled.div`
  display: flex;
  gap: 16px;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 8px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MetaDate = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ $overdue }) => ($overdue ? "#ef4444" : "inherit")};
  font-weight: ${({ $overdue }) => ($overdue ? 600 : 400)};
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: var(--space-sm);
  width: 100%;
  margin-top: 12px;
`;

const StatusSelect = styled.select`
  width: 100%;
  margin: 0;
  padding: 8px 12px;
  font-size: 0.85rem;
  height: auto;
  cursor: pointer;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: #ffffff;
  color: var(--text-main);
`;

const StatusBadge = styled.span`
  font-size: var(--text-xs);
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  display: inline-flex;
  align-items: center;
  background: ${({ $variant }) => {
    if ($variant === "pending") return "#fff7ed";
    if ($variant === "inProgress") return "#eff6ff";
    if ($variant === "completed") return "#f0fdf4";
    return "#ffffff";
  }};
  color: ${({ $variant }) => {
    if ($variant === "pending") return "#c2410c";
    if ($variant === "inProgress") return "#1d4ed8";
    if ($variant === "completed") return "#15803d";
    return "var(--text-main)";
  }};
  border: 1px solid
    ${({ $variant }) => {
      if ($variant === "pending") return "#ffedd5";
      if ($variant === "inProgress") return "#dbeafe";
      if ($variant === "completed") return "#bbf7d0";
      return "var(--border)";
    }};
`;

const DeleteButton = styled.button`
  margin-left: auto;
  background: #f8fafc;
  border: 1px solid rgba(148, 163, 184, 0.35);
  padding: 8px;
  border-radius: 10px;
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
