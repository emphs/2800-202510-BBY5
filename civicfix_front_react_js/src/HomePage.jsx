import React from 'react';
import { Link } from '@tanstack/react-router';

function HomePage() {
    return (
        <div className="container">
            <h1>Welcome to the HomePage!</h1>
            <p>This is the homepage of our website.</p>
            <div>
                <Link to="/login" className="btn btn-primary">Go to Login Page</Link>
            </div>
        </div>
    );
}

export default HomePage;
