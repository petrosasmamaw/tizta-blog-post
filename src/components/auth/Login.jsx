import { supabase } from "../../supabase";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [message, setMessage] = useState(null);
    const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setMessage(null);

		if (!email) return setError("Please enter an email.");
		if (!password) return setError("Please enter your password.");

		setLoading(true);
		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				setError(error.message || "Login failed.");
			} else {
				setMessage("Login successful.");
				// Optionally handle redirect here or emit an event
				setEmail("");
				setPassword("");
			}
		} catch (err) {
			setError(err.message || "An unexpected error occurred.");
		} finally {
			setLoading(false);
            navigate("/");
		}
	};

	return (
		<div className="auth-login">
			<h2 className="auth-title">Sign in</h2>

			<form className="auth-form" onSubmit={handleSubmit}>
				<label className="auth-label">
					Email
					<input
						type="email"
						className="auth-input auth-input-email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</label>

				<label className="auth-label">
					Password
					<input
						type="password"
						className="auth-input auth-input-password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</label>

				<button className="btn btn-submit" type="submit" disabled={loading}>
					{loading ? "Signing in..." : "Sign in"}
				</button>
			</form>

			{error && <div className="auth-error">{error}</div>}
			{message && <div className="auth-message">{message}</div>}
		</div>
	);
}