 import React, { useState } from "react";
import { toast } from "react-toastify";
import { updateProfile } from "./api.js";
import "./Account.css";

export default function Account({ user, onUpdate, onLogout }) {
  const [editing, setEditing]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [form, setForm]         = useState({
    name:  user.name,
    age:   user.age,
    email: user.email,
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await updateProfile({
        name:  form.name,
        age:   Number(form.age),
        email: form.email,
      });
      localStorage.setItem("user", JSON.stringify(data.user));
      onUpdate(data.user);
      toast.success("Profile updated!");
      setEditing(false);
    } catch (err) {
      toast.error(err.userMessage || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully.");
    onLogout();
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="account__wrapper">
      <div className="account__card">

        {/* Avatar */}
        <div className="account__avatar">{initials}</div>
        <h2 className="account__name">{user.name}</h2>
        <p className="account__email">{user.email}</p>

        <div className="account__divider" />

        {!editing ? (
          <>
            {/* Info display */}
            <div className="account__info">
              <div className="account__info-row">
                <span className="account__info-label">Full Name</span>
                <span className="account__info-value">{user.name}</span>
              </div>
              <div className="account__info-row">
                <span className="account__info-label">Age</span>
                <span className="account__info-value">{user.age}</span>
              </div>
              <div className="account__info-row">
                <span className="account__info-label">Email</span>
                <span className="account__info-value">{user.email}</span>
              </div>
            </div>

            <div className="account__actions">
              <button
                className="account__btn account__btn--edit"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
              <button
                className="account__btn account__btn--logout"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Edit form */}
            <form className="account__form" onSubmit={handleUpdate}>
              <div className="auth__field">
                <label className="auth__label">Full Name</label>
                <input
                  className="auth__input"
                  type="text"
                  name="name"
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
                  value={form.age}
                  onChange={handleChange}
                  disabled={loading}
                  min="1"
                  max="120"
                />
              </div>
              <div className="auth__field">
                <label className="auth__label">Email</label>
                <input
                  className="auth__input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="account__actions">
                <button
                  className="account__btn account__btn--edit"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  className="account__btn account__btn--logout"
                  type="button"
                  onClick={() => setEditing(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
