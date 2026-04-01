import React, { useState } from "react";
import { toast } from "react-toastify";
import { createTask } from "./api.js";
import "./TaskForm.css";

export default function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const isValid = title.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || saving) return;

    setSaving(true);
    try {
      const { data } = await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      toast.success("Task added!");
      onTaskCreated(data);
      setTitle("");
      setDescription("");
    } catch (err) {
      toast.error(err.userMessage || "Failed to add task.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="task-form__header">
        <span className="task-form__label">New Task</span>
      </div>
      <div className="task-form__fields">
        <div className="task-form__field">
          <input
            className="task-form__input"
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            disabled={saving}
            autoFocus
            aria-label="Task title"
          />
          <span className="task-form__char-count">{title.length}/120</span>
        </div>
        <div className="task-form__field">
          <textarea
            className="task-form__textarea"
            placeholder="Add a description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            maxLength={300}
            disabled={saving}
            aria-label="Task description"
          />
        </div>
      </div>
      <button
        className={`task-form__submit ${saving ? "task-form__submit--saving" : ""}`}
        type="submit"
        disabled={!isValid || saving}
      >
        {saving ? (
          <><span className="task-form__spinner" aria-hidden="true" />Saving…</>
        ) : (
          <><span className="task-form__plus" aria-hidden="true">+</span>Add Task</>
        )}
      </button>
    </form>
  );
}