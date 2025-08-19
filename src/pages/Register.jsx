import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8080/api/users/register/", formData);
      toast.success("Registered successfully!");
      navigate("/");
    } catch (error) {
      console.error(error.response?.data);
      toast.error("Registration failed!");
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4">
        <h3 className="text-center mb-3">Register</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Firstname</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter FirstName"
              value={formData.first_name}
              onChange={handleChange}
              name="first_name"
            />
        
          </div>
          <div className="mb-3">
            <label className="form-label">Lastname</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter LastName"
              value={formData.last_name}
              onChange={handleChange}
              name="last_name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              name="email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              name="password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 justify-content-center"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <a href="/" className="text-decoration-none">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
