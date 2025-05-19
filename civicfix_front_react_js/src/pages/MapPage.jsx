import React from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

export default function MapPage() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Nav />
            <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center bg-light">
                <h1 className="mb-4">Map Page</h1>
                <div
                    className="d-flex align-items-center justify-content-center bg-white rounded shadow"
                    style={{ width: '80vw', maxWidth: 800, height: 400, margin: '2rem 0' }}
                >
                    <span style={{ color: '#607d8b', fontSize: 24 }}>[Map Placeholder]</span>
                </div>
            </main>
            <Footer />
        </div>
    );
}
