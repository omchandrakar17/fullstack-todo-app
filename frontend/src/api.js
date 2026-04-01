import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.userMessage = "Cannot reach the server. Please check your connection.";
    } else {
      const status = error.response.status;
      const messages = {
        400: "Bad request. Please check your input.",
        401: "Invalid credentials or session expired.",
        403: "You don't have permission.",
        404: "Not found.",
        409: "Email already registered.",
        500: "Internal server error. Try again later.",
      };
      error.userMessage = messages[status] || "Unexpected error.";
    }
    return Promise.reject(error);
  }
);

export const registerUser  = (payload) => api.post("/auth/register", payload);
export const loginUser     = (payload) => api.post("/auth/login", payload);
export const getMe         = ()        => api.get("/auth/me");
export const updateProfile = (payload) => api.put("/auth/update", payload);

export const getTasks    = (filter)      => api.get("/tasks", { params: { filter } });
export const createTask  = (payload)     => api.post("/tasks", payload);
export const updateTask  = (id, payload) => api.put(`/tasks/${id}`, payload);
export const deleteTask  = (id)          => api.delete(`/tasks/${id}`);

export default api;