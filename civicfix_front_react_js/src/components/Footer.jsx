import React from 'react';

const Footer = () => {
    return (
        <footer className="text-center w-100 py-3">
            <p>&copy; {new Date().getFullYear()} CivicFix. All rights reserved.</p>
        </footer>
    );
};

export default Footer;