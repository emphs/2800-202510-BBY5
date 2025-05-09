import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import Footer from './partials/footer';

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
				navigate({ to: '/main' });
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
			<div
				className="flex-grow-1 d-flex justify-content-center align-items-center mt-4"
				style={{ backgroundColor: '#BFFFF0' }}
			>
				<div className="container">
					<div className="row justify-content-center align-items-center">
						<div className="col-md-3 d-flex justify-content-center">
							<h2 className="fw-bold text-center">Sign Up</h2>
						</div>

						<div className="col-md-5 ml-3">
							<form onSubmit={handleSubmit}>
								<div className="mb-3">
									<label htmlFor="username" className="form-label">Username</label>
									<input
										type="text"
										className="form-control"
										id="username"
										placeholder="Enter username"
										value={username}
										onChange={(e) => setUsername(e.target.value)}
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
									/>
								</div>
								<button type="submit" className="btn btn-primary fw-bold px-4 py-2">
									Sign Up
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}

export default SignupPage;
