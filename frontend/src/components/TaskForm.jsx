import { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { createTask } from "../services/api";
import { Plus, X } from "lucide-react";

export default function TaskForm({ onTaskCreated }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    assigneeEmail: "",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateEmail(form.assigneeEmail)) {
      const message = "Please enter a valid email address";
      setError(message);
      toast.error(message);
      return;
    }

    if (new Date(form.dueDate) < new Date()) {
      const message = "Due date must be in the future";
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);
    try {
      await createTask(form);
      setForm({ title: "", description: "", assigneeEmail: "", dueDate: "" });
      setSuccess(true);
      toast.success("Task created successfully");
      onTaskCreated();
      setTimeout(() => {
        setSuccess(false);
        setIsExpanded(false);
      }, 1500);
    } catch (err) {
      const message = err.message || "Failed to create task";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isExpanded) {
    return (
      <NewTaskButton onClick={() => setIsExpanded(true)}>
        <Plus size={20} /> Create New Task
      </NewTaskButton>
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormHeader>
        <div>
          <h3>Create a new task</h3>
          <FormSubtitle>
            Fill in the details below to track progress.
          </FormSubtitle>
        </div>
        <CloseButton type="button" onClick={() => setIsExpanded(false)}>
          <X size={20} />
        </CloseButton>
      </FormHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>Task created successfully!</SuccessMessage>}

      <FormGrid>
        <TextInput
          name="title"
          placeholder="Task Title"
          value={form.title}
          onChange={handleChange}
          required
          maxLength={100}
          disabled={loading}
        />

        <TextArea
          name="description"
          placeholder="Task Description (Optional)"
          value={form.description}
          onChange={handleChange}
          disabled={loading}
          rows="3"
        />

        <FormRow>
          <TextInput
            name="assigneeEmail"
            type="email"
            placeholder="Assignee Email"
            value={form.assigneeEmail}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <TextInput
            type="datetime-local"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </FormRow>
      </FormGrid>

      <FormActions>
        <SecondaryButton
          type="button"
          onClick={() => setIsExpanded(false)}
          disabled={loading}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Task"}
        </PrimaryButton>
      </FormActions>
    </Form>
  );
}

const NewTaskButton = styled.button`
  width: 100%;
  padding: 18px 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px dashed #cbd5f5;
  border-radius: 16px;
  color: var(--text-main);
  font-weight: 600;
  cursor: pointer;
  margin-bottom: var(--space-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: inset 0 0 0 1px rgba(226, 232, 240, 0.6);
`;

const Form = styled.form`
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 22px;
  margin-bottom: var(--space-2xl);
  box-shadow: var(--shadow-sm);
  animation: slideDown 0.3s ease-out;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
`;

const FormSubtitle = styled.p`
  margin: 4px 0 0;
  font-size: var(--text-sm);
  color: var(--text-muted);
`;

const CloseButton = styled.button`
  background: transparent;
  border: 1px solid rgba(148, 163, 184, 0.4);
  padding: 8px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const FormGrid = styled.div`
  display: grid;
  gap: var(--space-lg);
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 12px;
  font-family: inherit;
  font-size: var(--text-base);
  background: #ffffff;
  color: var(--text-main);
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 12px;
  font-family: inherit;
  font-size: var(--text-base);
  background: #ffffff;
  color: var(--text-main);
  resize: vertical;
`;

const FormActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-md);
  margin-top: var(--space-lg);
`;

const PrimaryButton = styled.button`
  background: var(--primary);
  color: white;
  border: none;
  padding: 12px 14px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
`;

const SecondaryButton = styled.button`
  background: white;
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 12px 14px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
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

const SuccessMessage = styled.div`
  background: #ecfdf3;
  color: #15803d;
  border: 1px solid #bbf7d0;
  padding: 10px 12px;
  border-radius: 12px;
  margin-bottom: 14px;
  font-size: var(--text-sm);
`;
