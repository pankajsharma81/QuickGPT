import React from "react";
import { useSystemTheme } from "../hooks/useSystemTheme";
import "../styles/Home.css";

const Home = () => {
  useSystemTheme();

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <h1 className="logo">QuickGPT</h1>
          <nav className="nav-links">
            <a href="/login" className="nav-link">Login</a>
            <a href="/register" className="nav-link nav-link-primary">Register</a>
          </nav>
        </div>
      </header>

      <main className="home-main">
        <section className="hero-section">
          <div className="hero-content">
            <h2 className="hero-title">Welcome to QuickGPT</h2>
            <p className="hero-subtitle">
              Fast, seamless, and intelligent. Your AI assistant powered by cutting-edge technology.
            </p>
            <div className="hero-buttons">
              <a href="/register" className="btn btn-primary">Get Started</a>
              <a href="/login" className="btn btn-secondary">Sign In</a>
            </div>
          </div>
          <div className="hero-image">
            <div className="gradient-box"></div>
          </div>
        </section>

        <section className="features-section">
          <h2 className="section-title">Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Fast & Responsive</h3>
              <p className="feature-description">Lightning-quick responses powered by modern technology</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure & Private</h3>
              <p className="feature-description">Your data is encrypted and protected with industry standards</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3 className="feature-title">Beautiful Design</h3>
              <p className="feature-description">Seamless user experience across all devices</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>&copy; 2025 QuickGPT. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
