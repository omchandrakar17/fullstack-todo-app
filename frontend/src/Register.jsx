import React, { useState } from "react";
import { toast } from "react-toastify";
import { registerUser } from "./api.js";
import "./Register.css";

export default function Register({ onLogin, goToLogin }) {
  const [form, setForm] = useState({
    name: "", age: "", email: "", password: "", confirm: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.age || !form.email || !form.password || !form.confirm) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await registerUser({
        name:     form.name,
        age:      Number(form.age),
        email:    form.email,
        password: form.password,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Account created! Welcome, " + data.user.name + "!");
      onLogin(data.user);
    } catch (err) {
      toast.error(err.userMessage || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth__wrapper">
      <div className="auth__card">
        <div className="auth__top">
          <h1 className="auth__title">Create Account</h1>
          <p className="auth__subtitle">Join and start managing your tasks</p>
        </div>

        <form className="auth__form" onSubmit={handleSubmit} noValidate>
          <div className="auth__row">
            <div className="auth__field">
              <label className="auth__label">Full Name</label>
              <input
                className="auth__input"
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="auth__field">
              <label className="auth__label">Age</label>
              <input
                className="auth__input"
                type="number"
                name="age"
                placeholder="25"
                value={form.age}
                onChange={handleChange}
                disabled={loading}
                min="1"
                max="120"
              />
            </div>
          </div>

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
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="auth__field">
            <label className="auth__label">Confirm Password</label>
            <input
              className="auth__input"
              type="password"
              name="confirm"
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button className="auth__btn" type="submit" disabled={loading}>
            {loading ? (
              <><span className="auth__spinner" /> Creating account...</>
            ) : "Create Account"}
          </button>
        </form>

        <p className="auth__switch">
          Already have an account?{" "}
          <button className="auth__link" onClick={goToLogin}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
