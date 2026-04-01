import React, { useEffect, useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getTasks } from "./api.js";
import TaskForm from "./TaskForm.jsx";
import TaskList from "./TaskList.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Account from "./Account.jsx";
import "./App.css";

export default function App() {
  const [user, setUser]       = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [page, setPage]       = useState("login");
  const [view, setView]       = useState("tasks");
  const [tasks, setTasks]     = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getTasks("all");
      setAllTasks(Array.isArray(data) ? data : []);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.userMessage || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user, fetchTasks]);

  const handleLogin = (userData) => {
    setUser(userData);
    setView("tasks");
  };

  const handleLogout = () => {
    setUser(null);
    setTasks([]);
    setAllTasks([]);
    setView("tasks");
    setPage("login");
  };

  const handleTaskCreated = useCallback((newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const total    = tasks.length;
  const done     = tasks.filter((t) => t.completed).length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  if (!user) {
    return (
      <>
        {page === "login" ? (
          <Login
            onLogin={handleLogin}
            goToRegister={() => setPage("register")}
          />
        ) : (
          <Register
            onLogin={handleLogin}
            goToLogin={() => setPage("login")}
          />
        )}
        <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
      </>
    );
  }

  if (view === "account") {
    return (
      <>
        <div className="app__topbar">
          <span className="app__topbar-logo">My Tasks</span>
          <div className="app__topbar-nav">
            <button
              className="app__topbar-btn"
              onClick={() => setView("tasks")}
            >
              Tasks
            </button>
            <button
              className="app__topbar-btn app__topbar-btn--active"
              onClick={() => setView("account")}
            >
              Account
            </button>
          </div>
        </div>
        <Account
          user={user}
          onUpdate={(updatedUser) => setUser(updatedUser)}
          onLogout={handleLogout}
        />
        <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
      </>
    );
  }

  return (
    <div className="app">
      <div className="app__bg" aria-hidden="true">
        <div className="app__bg-orb app__bg-orb--1" />
        <div className="app__bg-orb app__bg-orb--2" />
      </div>
      <main className="app__card">
        <header className="app__header">
          <div className="app__header-top">
            <div>
              <h1 className="app__title">My Tasks</h1>
              {!loading && total > 0 && (
                <p className="app__subtitle">{done} of {total} completed</p>
              )}
            </div>
            <div className="app__header-right">
              {!loading && total > 0 && (
                <div className="app__progress-ring" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
                  <svg viewBox="0 0 36 36" width="52" height="52">
                    <circle className="app__ring-bg" cx="18" cy="18" r="15.9155" fill="none" strokeWidth="2.5" />
                    <circle className="app__ring-fill" cx="18" cy="18" r="15.9155" fill="none" strokeWidth="2.5"
                      strokeDasharray={`${progress} 100`} strokeLinecap="round" transform="rotate(-90 18 18)" />
                  </svg>
                  <span className="app__ring-label">{progress}%</span>
                </div>
              )}
              <button
                className="app__account-btn"
                onClick={() => setView("account")}
                title="Account"
              >
                {user.name.charAt(0).toUpperCase()}
              </button>
            </div>
          </div>
        </header>

        <TaskForm onTaskCreated={handleTaskCreated} />

        <section className="app__list-section">
          <TaskList
            tasks={tasks}
            setTasks={setTasks}
            allTasks={allTasks}
            setAllTasks={setAllTasks}
            initialLoading={loading}
          />
        </section>
      </main>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}