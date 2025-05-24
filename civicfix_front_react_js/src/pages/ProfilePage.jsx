import React, { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

/**
 * ProfilePage is a React component that renders a user's profile page.
 * It displays the user's profile information including username, email,
 * and user type. Users can edit their username, change their password,
 * and log out. The component fetches user data from the backend when mounted
 * and allows users to toggle edit modes for updating their profile details.
 * Additionally, the component handles errors and loading states during data fetching.
 */

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changePasswordMsg, setChangePasswordMsg] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // Example: fetch user profile from backend
    fetch("/api/auth/authenticated", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject("Not logged in")))
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(typeof err === "string" ? err : "Failed to load profile");
        setLoading(false);
      });
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Nav />
      <main className="flex-grow-1 bg-light" style={{ paddingTop: "80px" }}>
        <div className="container py-5">
          <h2 className="mb-5 text-center fw-bold" style={{ fontSize: "2.5rem" }}>
            Profile
          </h2>
          {loading ? (
            <div className="text-center text-muted">Loading...</div>
          ) : error ? (
            <div className="text-danger text-center">{error}</div>
          ) : profile ? (
            <div className="row justify-content-center align-items-start">
              {/* Profile Picture */}
              <div className="col-12 col-md-4 d-flex flex-column align-items-center mb-4 mb-md-0">
                <img
                  src={`https://api.dicebear.com/7.x/identicon/svg?seed=${profile.email || "user"}`}
                  alt="Profile avatar"
                  style={{
                    width: 160,
                    height: 160,
                    borderRadius: "50%",
                    background: "#f4f4f4",
                    border: "4px solid #D5F5E3",
                  }}
                />
                <div
                  className="mt-2"
                  style={{
                    color: "#007bff",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}>
                  Change profile picture
                </div>
                <button
                  className="btn btn-outline-danger mt-3"
                  onClick={async () => {
                    await fetch("/api/logout", { method: "POST", credentials: "include" });
                    window.location.href = "/";
                  }}>
                  Log Out
                </button>
              </div>
              {/* User Info */}
              <div className="col-12 col-md-6 bg-white rounded shadow p-4 ms-md-4">
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.username || ""}
                    disabled={!editMode}
                    onChange={(e) => {
                      if (editMode) setProfile((p) => ({ ...p, username: e.target.value }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={profile.email || ""}
                    disabled
                  />
                </div>
                <div className="mb-3 d-flex align-items-center">
                  <div className="flex-grow-1">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" value={"••••••••"} disabled />
                  </div>
                </div>
                {editMode && (
                  <div className="mb-3 border rounded p-3 bg-light">
                    <div className="mb-2">
                      <label className="form-label mb-1">Current Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        autoComplete="current-password"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label mb-1">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                    </div>
                    <button
                      className="btn btn-primary mt-2"
                      disabled={changingPassword || !currentPassword || !newPassword}
                      onClick={async () => {
                        setChangingPassword(true);
                        setChangePasswordMsg("");
                        try {
                          const res = await fetch("/api/auth/change-password", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify({ currentPassword, newPassword }),
                          });
                          const data = await res.json();
                          if (res.ok) {
                            setChangePasswordMsg("Password changed successfully.");
                            setCurrentPassword("");
                            setNewPassword("");
                          } else {
                            setChangePasswordMsg(data.message || "Failed to change password.");
                          }
                        } catch (err) {
                          setChangePasswordMsg("Failed to change password.");
                        }
                        setChangingPassword(false);
                      }}>
                      Change Password
                    </button>
                    {changePasswordMsg && (
                      <div
                        className={`mt-2 text-${
                          changePasswordMsg.includes("success") ? "success" : "danger"
                        }`}>
                        {changePasswordMsg}
                      </div>
                    )}
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">User Type</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.userType || profile.user_type || ""}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">User ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.userId || profile.user_id || ""}
                    disabled
                  />
                </div>
                {/* Add more user info fields here if needed */}
                <div className="mt-5 d-flex gap-3">
                  {editMode && (
                    <button
                      className="btn btn-success px-4"
                      disabled={!profile.username || profile.username.trim() === ""}
                      onClick={async () => {
                        // Save Edit logic
                        try {
                          const res = await fetch("/api/users/change-username", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify({ username: profile.username }),
                          });
                          const data = await res.json();
                          if (res.ok) {
                            setEditMode(false);
                            setError("");
                            setProfile((p) => ({
                              ...p,
                              username: data.username || profile.username,
                            }));
                            alert("Profile updated successfully.");
                          } else {
                            setError(data.message || "Failed to update profile.");
                          }
                        } catch (err) {
                          setError("Failed to update profile.");
                        }
                      }}>
                      Save Edit
                    </button>
                  )}
                  <button
                    className="btn btn-outline-primary px-4"
                    onClick={() => setEditMode((v) => !v)}>
                    {editMode ? "Cancel Edit" : "Edit Profile"}
                  </button>
                  <button
                    className="btn btn-outline-danger px-4"
                    onClick={() => alert("Delete account feature coming soon!")}>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}
