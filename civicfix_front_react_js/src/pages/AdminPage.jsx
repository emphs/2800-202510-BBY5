import React, { useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

/**
 * Fetches all users from the backend API.
 * @returns {Promise<Array<{id: number, username: string, email: string, userType: string}>>} List of all users
 * @throws {Error} If the fetch fails
 */
async function fetchAllUsers() {
  const res = await fetch("/api/users", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch users");
  const users = await res.json();
  // Sort alphabetically by username or email
  return users.sort((a, b) => (a.email || a.username).localeCompare(b.email || b.username));
}

/**
 * Fetches all issues from the backend API.
 * @returns {Promise<Array<{id: number, title: string, type: string, status: string, creator_id: number, lat: number, lon: number}>>} List of all issues
 * @throws {Error} If the fetch fails
 */
async function fetchAllIssues() {
  const res = await fetch("/api/issues/admin", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch reports");
  const reports = await res.json();
  // Sort alphabetically by title
  return reports.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
}

/**
 * The AdminPage component displays a table of all users in the database, as
 * well as a table of all issues in the database. The user can click on the
 * "Manage Users" button to fetch the list of users, or click on the "Manage
 * Reports" button to fetch the list of issues. The component handles errors
 * by displaying an error message, and loading by displaying a "Loading..."
 * message. The component also displays a message if no users or reports are
 * found in the database.
 * @function
 * @returns {JSX.Element} The rendered page
 */
const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Handles the click event for the "Manage Users" button.
   * Fetches all users from the backend API and updates the component state
   * with the list of users, shows the user list, and hides the report list.
   * @function
   */
  const handleManageUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const userList = await fetchAllUsers();
      setUsers(userList);
      setShowUsers(true);
      setShowReports(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the click event for the "Manage Reports" button.
   * Fetches all issues from the backend API and updates the component state
   * with the list of issues, shows the issue list, and hides the user list.
   * Catches any errors and updates the component state with the error message.
   * @function
   */
  const handleManageReports = async () => {
    setLoading(true);
    setError("");
    try {
      const reportList = await fetchAllIssues();
      setReports(reportList);
      setShowReports(true);
      setShowUsers(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Nav />

      {/* Main Content Section */}
      <div className="container mt-5 pt-5" style={{ maxWidth: "1000px" }}>
        <h2 className="mb-4 text-center">Admin Page</h2>
        <div className="d-flex justify-content-center mb-4 gap-3">
          <button className="btn btn-primary" onClick={handleManageUsers}>
            Manage users
          </button>
          <button className="btn btn-success" onClick={handleManageReports}>
            Manage reports
          </button>
        </div>

        {/* Placeholder for table or content area */}
        <div className="bg-light p-4 rounded shadow-sm" style={{ minHeight: "500px" }}>
          {loading && <div className="text-center">Loading...</div>}
          {error && <div className="text-danger text-center">{error}</div>}
          {showUsers && users.length > 0 && (
            <table className="table table-striped table-bordered mt-3">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>User Type</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user.id || idx}>
                    <td>{user.email || user.username}</td>
                    <td>{user.user_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {showUsers && users.length === 0 && !loading && (
            <div className="text-center">No users found.</div>
          )}
          {showReports && reports.length > 0 && (
            <table className="table table-striped table-bordered mt-3">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Creator ID</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, idx) => (
                  <tr key={report.id || idx}>
                    <td>{report.title}</td>
                    <td>{report.type}</td>
                    <td>{report.status}</td>
                    <td>{report.creator_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {showReports && reports.length === 0 && !loading && (
            <div className="text-center">No reports found.</div>
          )}
          {!showUsers && !showReports && !loading && !error && (
            <p className="text-muted text-center">Database content will appear here...</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminPage;
