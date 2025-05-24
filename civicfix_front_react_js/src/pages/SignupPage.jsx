import React, { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import Footer from "../components/Footer";

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * SignupPage is a page that allows users to sign up for a CivicFix account.
 * It contains a form with fields for username, email, and password.
 * When the form is submitted, it sends a POST request to the server to create a new user account.
 * If the request is successful, it navigates to the home page.
 * Otherwise, it displays an error message.
 *
 * @returns A JSX element representing the SignupPage.
 */
/*******  5028e4a4-e335-4f63-8e77-f1dfa770dabf  *******/
function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup successful!");
        navigate({ to: "/home" });
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 text-center">
      <main
        className="flex-grow-1 d-flex align-items-center justify-content-center"
        style={{
          minHeight: "80vh",
          paddingTop: "80px",
          paddingBottom: "40px",
          background: "#E6F7D0",
          margin: "0 auto",
          width: "100%",
        }}>
        <div
          className="container-fluid d-flex flex-column align-items-center justify-content-center"
          style={{
            width: "100%",
            padding: "0 4vw",
          }}>
          <img
            src="/logos/civicfix_logo1.png"
            alt="CivicFix Logo"
            style={{
              width: "min(60vw, 220px)",
              maxWidth: "100%",
              height: "auto",
              marginBottom: "2vh",
            }}
            className="mb-3"
          />
          <h2
            className="fw-bold text-center mb-4"
            style={{ fontSize: "clamp(1.7rem, 5vw, 2.4rem)", lineHeight: 1.1 }}>
            Sign Up
          </h2>
          <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: "500px" }}>
            <div className="mb-3 text-start">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ borderColor: "#6DC9A7" }}
              />
            </div>
            <div className="mb-3 text-start">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ borderColor: "#6DC9A7" }}
              />
            </div>
            <div className="mb-3 text-start">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ borderColor: "#6DC9A7" }}
              />
            </div>
            <button
              type="submit"
              className="btn w-100"
              style={{
                backgroundColor: "#27ae60",
                color: "white",
                border: "none",
                fontSize: "clamp(1rem, 4vw, 1.2rem)",
                padding: "1em 0",
                maxWidth: "500px",
              }}>
              Sign Up
            </button>
            <div className="text-center mt-3" style={{ fontSize: "clamp(0.95rem, 3vw, 1.1rem)" }}>
              <span>Already have an account? </span>
              <Link
                to="/login"
                className="link-primary"
                style={{
                  textDecoration: "underline",
                  cursor: "pointer",
                }}>
                Log In
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default SignupPage;
