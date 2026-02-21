import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // 🔑 LOGIN HANDLER
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/login",
        {
          identifier,
          password
        }
      );

      // save token
      localStorage.setItem("token", response.data.token);

      alert("Login successful");
      navigate("/profile");

      // optional: navigate to profile or home
      // navigate("/profile");

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Login to continue shopping</p>

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email or Phone number"
            className="input-field"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="form-extra">
            <span className="forgot">Forgot password?</span>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <p className="signup-text">
            Don’t have an account?
            <span
              className="signup-link"
              onClick={() => navigate("/get-started")}
            >
              {" "}Get Started
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
