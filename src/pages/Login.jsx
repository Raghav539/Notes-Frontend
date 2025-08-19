import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";

export default function Login({ onLogin, token }) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  // Navigate when token is set
  useEffect(() => {
    if (token) {
      console.log("Token received, navigating to /"); // Debug
      navigate("/");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(
        "http://127.0.0.1:8080/api/users/login/",
        credentials
      );
      console.log("API response:", res.data); // Debug
      const { access, refresh } = res.data;
      localStorage.setItem("refresh", refresh);
      onLogin(access);
      toast.success("Logged in successfully!");
    } catch (error) {
      console.error("Login error:", error.response?.data); // Debug
      toast.error(error.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4">
        <h3 className="text-center mb-3">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={credentials.email}
              onChange={handleChange}
              name="email"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={credentials.password}
              onChange={handleChange}
              name="password"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 justify-content-center"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-3">
          Don’t have an account?{" "}
          <Link to="/register" className="text-decoration-none">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}