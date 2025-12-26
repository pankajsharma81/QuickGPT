import { useState } from "react";
import { useSystemTheme } from "../hooks/useSystemTheme";
import "../styles/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { RiRobot2Line } from "react-icons/ri";

const Login = () => {
  useSystemTheme();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      await axios
        .post("http://localhost:3000/api/auth/login", formData, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);
          // Store a simple flag/token so the frontend knows the user is authenticated
          localStorage.setItem("quickgpt_token", "logged_in");
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setSubmitting(false);
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <RiRobot2Line size={48} />
          </div>
        </div>
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue to QuickGPT</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
