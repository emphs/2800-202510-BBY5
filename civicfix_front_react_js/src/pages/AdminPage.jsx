import React, { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

// Pretend this is imported from userList.js
async function fetchAllUsers() {
    // This would actually call your backend API
    // For now, just a placeholder
    const res = await fetch('/api/admin/users', { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch users');
    const users = await res.json();
    // Sort alphabetically by username or email
    return users.sort((a, b) => (a.email || a.username).localeCompare(b.email || b.username));
}

// Pretend this is imported from reportList.js
async function fetchAllReports() {
    const res = await fetch('/api/admin/reports', { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch reports');
    const reports = await res.json();
    // Sort alphabetically by title
    return reports.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
}

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [reports, setReports] = useState([]);
    const [showUsers, setShowUsers] = useState(false);
    const [showReports, setShowReports] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleManageUsers = async () => {
        setLoading(true);
        setError('');
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

    const handleManageReports = async () => {
        setLoading(true);
        setError('');
        try {
            const reportList = await fetchAllReports();
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
            <div className="container mt-5 pt-5" style={{ maxWidth: '1000px' }}>
                <h2 className="mb-4 text-center">Admin Page</h2>
                <div className="d-flex justify-content-center mb-4 gap-3">
                    <button className="btn btn-primary" onClick={handleManageUsers}>Manage users</button>
                    <button className="btn btn-success" onClick={handleManageReports}>Manage reports</button>
                </div>

                {/* Placeholder for table or content area */}
                <div className="bg-light p-4 rounded shadow-sm" style={{ minHeight: '500px' }}>
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
