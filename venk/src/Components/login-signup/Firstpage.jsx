import React from "react";
import { useNavigate } from "react-router-dom";
import "./Firstpage.css";
import shopping_bag from "../Assests/image.png";
import famam_brand from "../Assests/famam-brand.png"; // 👈 ADD THIS

const Firstpage = () => {
  const navigate = useNavigate();

  return (
    <div className="page">

      {/* ---------- TOP LEFT LOGO ---------- */}
      <div className="top-row">
        <div className="slant-logo">
          <span className="slant s1"></span>
          <span className="slant s2"></span>
          <span className="slant s2"></span>
          <span className="slant"></span>
        </div>
        <h3 className="logo-text">Lask</h3>
      </div>

      {/* ---------- CENTER CONTENT ---------- */}
      <div className="center-container">

        {/* 👇 IMAGES SIDE BY SIDE */}
        <div className="image-row">
          <img
            src={shopping_bag}
            alt="Shopping bags"
            className="shopping-image"
          />

          <img
            src={famam_brand}
            alt="FAMAM brands"
            className="famam-image"
          />
        </div>

        {/* Title */}
        <h1 className="title">FAMAM</h1>

        {/* Tagline */}
        <p className="subtitle">
          You are on the right way for online shopping
        </p>

        {/* Buttons */}
        <div className="button-row">
          <button
            className="btn secondary"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="btn primary"
            onClick={() => navigate("/get-started")}
          >
            Get Started
          </button>
        </div>

      </div>
    </div>
  );
};

export default Firstpage;
