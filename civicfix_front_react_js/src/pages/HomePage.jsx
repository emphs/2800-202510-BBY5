import React, { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import Nav from '../components/Nav';
import MobileMap from '../MainMap';
import Footer from '../components/Footer';

function HomePage() {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        fetch('/api/me', { credentials: 'include' })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && data.email) setUserName(data.username); 
            });
    }, []);
    
    return (
        <>
            <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 text-center">
                <Nav />
                <div className="container pt-5" style={{ maxWidth: '1200px', marginTop: '80px' }}>
                    <h2 className="mb-3">Hello, {userName || 'User'}!</h2>
                    <h5 className="mb-3">Recent Reports:</h5>
                    <div className="d-flex justify-content-center mb-4">
                        <div className="w-100" style={{ maxWidth: '95vw' }}>
                            <MobileMap />
                        </div>
                    </div>
                    <hr />
                    <div className="container" style={{ paddingTop: '70px' }}>
                        <h1>Welcome to the HomePage!</h1>
                        <p>This is the homepage of our website.</p>
                        <button
                            className="btn btn-outline-danger mt-3"
                            onClick={async () => {
                                await fetch('/api/logout', { method: 'POST', credentials: 'include' });
                                window.location.href = '/';
                            }}
                        >
                            Log Out
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default HomePage;
