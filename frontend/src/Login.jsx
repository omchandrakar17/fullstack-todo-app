 import React, { useState } from "react";
import { toast } from "react-toastify";
import { loginUser } from "./api.js";
import "./Login.css";

export default function Login({ onLogin, goToRegister }) {
  const [form, setForm]       = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Welcome back, " + data.user.name + "!");
      onLogin(data.user);
    } catch (err) {
      toast.error(err.userMessage || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth__wrapper">
      <div className="auth__card">
        <div className="auth__top">
          <h1 className="auth__title">Welcome Back</h1>
          <p className="auth__subtitle">Sign in to your account</p>
        </div>

        <form className="auth__form" onSubmit={handleSubmit} noValidate>
          <div className="auth__field">
            <label className="auth__label">Email</label>
            <input
              className="auth__input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="auth__field">
            <label className="auth__label">Password</label>
            <input
              className="auth__input"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button
            className="auth__btn"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <><span className="auth__spinner" /> Signing in...</>
            ) : "Sign In"}
          </button>
        </form>

        <p className="auth__switch">
          Don't have an account?{" "}
          <button className="auth__link" onClick={goToRegister}>
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}
