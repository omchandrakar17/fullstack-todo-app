import React, { useState } from "react";
import { toast } from "react-toastify";
import { updateTask, deleteTask } from "./api.js";
import "./TaskList.css";

export default function TaskList({ tasks, setTasks, initialLoading }) {
  const [busy, setBusy]     = useState({});
  const [filter, setFilter] = useState("all");

  const setTaskBusy = (id, state) =>
    setBusy((prev) => ({ ...prev, [id]: state }));

  const clearTaskBusy = (id) =>
    setBusy((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

  const handleToggle = async (task) => {
    const taskId = task._id;
    if (busy[taskId]) return;
    setTaskBusy(taskId, "updating");
    setTasks((prev) =>
      prev.map((t) =>
        t._id === taskId ? { ...t, completed: !t.completed } : t
      )
    );
    try {
      const { data } = await updateTask(taskId, { completed: !task.completed });
      setTasks((prev) =>
        prev.map((t) => (t._id === data._id ? data : t))
      );
      toast.success(data.completed ? "Task completed!" : "Task reopened.");
    } catch (err) {
      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskId ? { ...t, completed: task.completed } : t
        )
      );
      toast.error(err.userMessage || "Could not update task.");
    } finally {
      clearTaskBusy(taskId);
    }
  };

  const handleDelete = async (id) => {
    if (busy[id]) return;
    setTaskBusy(id, "deleting");
    const snapshot = tasks.find((t) => t._id === id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
    try {
      await deleteTask(id);
      toast.success("Task deleted.");
    } catch (err) {
      if (snapshot)
        setTasks((prev) =>
          prev.some((t) => t._id === id) ? prev : [...prev, snapshot]
        );
      toast.error(err.userMessage || "Could not delete task.");
    } finally {
      clearTaskBusy(id);
    }
  };

  const counts = {
    all:       tasks.length,
    pending:   tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  const filteredTasks =
    filter === "pending"   ? tasks.filter((t) => !t.completed) :
    filter === "completed" ? tasks.filter((t) => t.completed)  :
    tasks;

  if (initialLoading) {
    return (
      <div className="tasklist__state">
        <div className="tasklist__loader">
          <span className="tasklist__dot" />
          <span className="tasklist__dot" />
          <span className="tasklist__dot" />
        </div>
        <p className="tasklist__state-text">Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="tasklist">
      <div className="tasklist__filters">
        {["all", "pending", "completed"].map((f) => (
          <button
            key={f}
            className={
              "tasklist__filter-btn" +
              (filter === f ? " tasklist__filter-btn--active" : "")
            }
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="tasklist__filter-count">{counts[f]}</span>
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="tasklist__state tasklist__empty">
          <div className="tasklist__empty-icon">✦</div>
          <p className="tasklist__state-text">
            {filter === "all"
              ? "No tasks yet — add one above!"
              : filter === "pending"
              ? "No pending tasks. Great job!"
              : "No completed tasks yet."}
          </p>
        </div>
      )}

      {filteredTasks.length > 0 && (
        <ul className="tasklist__items" role="list">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              busyState={busy[task._id]}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function TaskItem({ task, busyState, onToggle, onDelete }) {
  const isUpdating = busyState === "updating";
  const isDeleting = busyState === "deleting";
  const isBusy     = Boolean(busyState);

  return (
    <li
      className={
        "task-item" +
        (task.completed ? " task-item--done" : "") +
        (isDeleting ? " task-item--deleting" : "")
      }
      role="listitem"
    >
      <button
        className={
          "task-item__check" +
          (task.completed ? " task-item__check--checked" : "")
        }
        onClick={() => onToggle(task)}
        disabled={isBusy}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        {isUpdating ? (
          <span className="task-item__spinner" />
        ) : task.completed ? (
          <span>✓</span>
        ) : null}
      </button>
      <div className="task-item__content">
        <span className="task-item__title">{task.title}</span>
        {task.description && (
          <span className="task-item__desc">{task.description}</span>
        )}
      </div>
      <button
        className="task-item__delete"
        onClick={() => onDelete(task._id)}
        disabled={isBusy}
        aria-label={"Delete task"}
      >
        {isDeleting ? (
          <span className="task-item__spinner task-item__spinner--dark" />
        ) : (
          <span>X</span>
        )}
      </button>
    </li>
  );
}