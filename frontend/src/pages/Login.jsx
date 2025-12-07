import { useState } from "react";
import { useSystemTheme } from "../hooks/useSystemTheme";
import "../styles/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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
        <h1>Login</h1>
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

          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
