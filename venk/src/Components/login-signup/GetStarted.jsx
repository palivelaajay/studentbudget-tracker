import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./GetStarted.css";

const GetStarted = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:4000/signup", {
        name,
        email,
        phone,
        password
      });

      alert("Signup successful, please login");
      navigate("/login");

    } catch (error) {
      // alert(error.response?.data?.message || "Signup failed");
      console.log(error.response?.data);
alert(JSON.stringify(error.response?.data));

    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2 className="signup-title">Get Started</h2>
        <p className="signup-subtitle">
          Create your account for smarter shopping
        </p>

        <form className="signup-form" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email Address"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Phone Number"
            className="input-field"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="signup-btn">
            Create Account
          </button>

          <p className="signin-text">
            Already have an account?
            <span
              className="signin-link"
              onClick={() => navigate("/login")}
            >
              {" "}Sign in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default GetStarted;
