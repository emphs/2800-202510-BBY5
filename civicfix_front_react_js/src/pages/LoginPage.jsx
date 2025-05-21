import React, { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import Footer from "../components/Footer";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate({ to: "/home" });
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Network error");
      console.error(err);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container d-flex flex-column justify-content-center align-items-center flex-grow-1">
        <h2 className="mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: "400px" }}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
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
          <div className="mb-3">
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
          <button type="submit" className="btn btn-primary w-100">
            Log In
          </button>
          <div className="text-center mt-3">
            <span>New to Civicfix? </span>
            <Link
              to="/signup"
              className="link-primary"
              style={{ textDecoration: "underline", cursor: "pointer" }}>
              Create account
            </Link>
          </div>
        </form>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default LoginPage;
