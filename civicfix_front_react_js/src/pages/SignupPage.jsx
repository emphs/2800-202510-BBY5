import React, { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import Footer from '../components/Footer';

function SignupPage() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch('/api/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, email, password })
			});

			const data = await response.json();

			if (response.ok) {
				alert('Signup successful!');
				navigate({ to: '/home' });
			} else {
				alert(data.message || 'Signup failed');
			}
		} catch (err) {
			console.error('Signup error:', err);
			alert('Something went wrong.');
		}
	};

	return (
		<div className="d-flex flex-column min-vh-100">
				<div className="container d-flex flex-column justify-content-center align-items-center flex-grow-1">
				<h2 className="mb-4 fw-bold text-center">Sign Up</h2>
				<form onSubmit={handleSubmit} className="w-100" style={{maxWidth: '400px'}}>
					<div className="mb-3">
						<label htmlFor="username" className="form-label">Username</label>
						<input
							type="text"
							className="form-control"
							id="username"
							placeholder="Enter username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							style={{ borderColor: '#6DC9A7' }}
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="email" className="form-label">Email</label>
						<input
							type="email"
							className="form-control"
							id="email"
							placeholder="Enter email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							style={{ borderColor: '#6DC9A7' }}
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="password" className="form-label">Password</label>
						<input
							type="password"
							className="form-control"
							id="password"
							placeholder="Enter password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							style={{ borderColor: '#6DC9A7' }}
						/>
					</div>
					<button type="submit" className="btn btn-primary fw-bold px-4 py-2 w-100">
						Sign Up
					</button>
					<div className="text-center mt-3">
						<span>Already have an account? </span>
						<Link
							to="/login"
							className="link-primary"
							style={{ textDecoration: 'underline', cursor: 'pointer' }}
						>
							Log In
						</Link>
					</div>
				</form>
			</div>
			<div>
				<Footer />
			</div>
		</div>
	);
}

export default SignupPage;
