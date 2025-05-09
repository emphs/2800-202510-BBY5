import React from 'react';
import { Link } from '@tanstack/react-router';
import Footer from './partials/footer';
import NavBar from './partials/nav';   

function MainPage() {
    return (
        <div className="container py-5">
            <NavBar />

            {/* Top Section: Recent Reports */}
            <div className="mb-5 mt-3">
                <h4 className="fw-bold mb-3">Recent Reports</h4>
                <div
                    className="w-100"
                    style={{
                        backgroundColor: '#e9ecef',
                        height: '300px',
                        borderRadius: '0.5rem',
                        border: '1px solid #ced4da',
                    }}
                ><p>Placeholder for a map</p></div>
            </div>

            {/* Horizontal Separator */}
            <hr className="my-5" />

            {/* Example Article 1 */}
            <div className="mb-5">
                <h5 className="fw-bold mb-3">Issue #1</h5>
                <p className="text-muted">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </div>

            {/* Example Article 2 */}
            <div className="mb-5">
                <h5 className="fw-bold mb-3">Issue #2</h5>
                <p className="text-muted">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                    cupidatat non proident, sunt in culpa qui officia deserunt mollit
                    anim id est laborum.
                </p>
            </div>

            {/* Example Article 3 */}
            <div className="mb-5">
                <h5 className="fw-bold mb-3">Issue #3</h5>
                <p className="text-muted">
                    Quis autem vel eum iure reprehenderit qui in ea voluptate velit
                    esse quam nihil molestiae consequatur, vel illum qui dolorem eum
                    fugiat quo voluptas nulla pariatur?
                </p>
            </div>

            <Footer />
        </div>
    );
}

export default MainPage;
