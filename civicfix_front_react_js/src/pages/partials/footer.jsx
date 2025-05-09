import React from 'react';

const Footer = () => {
    return (
        <footer style={{ textAlign: 'center', padding: '1rem'}}>
            <p>&copy; {new Date().getFullYear()} CivicFix. All rights reserved.</p>
        </footer>
    );
};

export default Footer;