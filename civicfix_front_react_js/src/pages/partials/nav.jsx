import React from 'react';
import { Link } from '@tanstack/react-router';

const NavBar = () => {
	return (
		<nav
			className="navbar navbar-expand-lg fixed-top shadow-sm"
			style={{ backgroundColor: '#BFFFF0' }}
		>
			<div className="container-fluid">
				<span className="navbar-brand fw-bold">CivicFix</span>

				<div className="d-flex gap-3">
					<span className="nav-link text-primary" style={{ cursor: 'pointer' }}>
						Map
					</span>
					<span className="nav-link text-primary" style={{ cursor: 'pointer' }}>
						Report
					</span>
					<span className="nav-link text-primary" style={{ cursor: 'pointer' }}>
						Settings
					</span>
					<span className="nav-link text-primary" style={{ cursor: 'pointer' }}>
						Logout
					</span>
				</div>
			</div>
		</nav>
	);
};

export default NavBar;
