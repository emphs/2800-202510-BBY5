import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Example: fetch user profile from backend
        fetch('/api/me', { credentials: 'include' })
            .then(res => res.ok ? res.json() : Promise.reject('Not logged in'))
            .then(data => {
                setProfile(data);
                setLoading(false);
            })
            .catch(err => {
                setError(typeof err === 'string' ? err : 'Failed to load profile');
                setLoading(false);
            });
    }, []);

    return (
        <div className="d-flex flex-column min-vh-100">
            <Nav />
            <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center bg-light" style={{ paddingTop: '80px' }}>
                <div className="bg-white rounded shadow p-4" style={{ minWidth: 320, maxWidth: 400 }}>
                    <h2 className="mb-4 text-center">Profile</h2>
                    {loading ? (
                        <div className="text-center text-muted">Loading...</div>
                    ) : error ? (
                        <div className="text-danger text-center">{error}</div>
                    ) : profile ? (
                        <>
                            <div className="mb-3 text-center">
                                <img
                                    src={`https://api.dicebear.com/7.x/identicon/svg?seed=${profile.email || 'user'}`}
                                    alt="Profile avatar"
                                    style={{ width: 80, height: 80, borderRadius: '50%' }}
                                />
                            </div>
                            <div className="mb-2">
                                <strong>Email:</strong> <span>{profile.email}</span>
                            </div>
                            {profile.username && (
                                <div className="mb-2">
                                    <strong>Username:</strong> <span>{profile.username}</span>
                                </div>
                            )}
                            <div className="mb-2">
                                <strong>User Type:</strong> <span className="badge bg-info text-dark">{profile.userType || profile.user_type}</span>
                            </div>
                            <div className="mb-2">
                                <strong>User ID:</strong> <span>{profile.userId || profile.user_id}</span>
                            </div>
                            <div className="mt-4 d-flex justify-content-between">
                                <button className="btn btn-outline-primary btn-sm" disabled>Edit Profile</button>
                                <button className="btn btn-outline-danger btn-sm" disabled>Delete Account</button>
                            </div>
                        </>
                    ) : null}
                </div>
            </main>
            <Footer />
        </div>
    );
}