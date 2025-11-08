import React, { useState } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";

export default function Register() {
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
		if (!password || password.length < 6)
			return setError("Password must be at least 6 characters.");

		setLoading(true);
		try {
			const { data, error } = await supabase.auth.signUp({ email, password });
			if (error) {
				setError(error.message || "Registration failed.");
			} else {
				// supabase sends a confirmation email by default for projects with email confirmations
				setMessage(
					"Registration successful. Check your email for a confirmation link (if configured)."
				);
				setEmail("");
				setPassword("");
			}
		} catch (err) {
			setError(err.message || "An unexpected error occurred.");
		} finally {
			setLoading(false);
            navigate("/login");
		}
	};

	return (
		<div className="auth-register">
			<h2 className="auth-title">Create an account</h2>

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
						minLength={6}
					/>
				</label>

				<button className="btn btn-submit" type="submit" disabled={loading}>
					{loading ? "Creating..." : "Sign up"}
				</button>
			</form>

			{error && <div className="auth-error">{error}</div>}
			{message && <div className="auth-message">{message}</div>}
		</div>
	);
}
