import React from "react";
import { supabase } from "../../supabase";
import { Link } from "react-router-dom";

export default function Navbar({ user }) {
	const signout = async () => {
		try {
			await supabase.auth.signOut();
		} catch (err) {
			// swallow - caller/UI can show errors if needed
			console.error("Sign out error:", err);
		}
	};

	const classes = ["navbar"];
	if (!user) classes.push("logged-out");

	return (
		<nav className={classes.join(" ")}>
			<div className="navbar-left">
				<div className="navbar-actions">
					<Link to="/"><button type="button" className="btn btn-home">Home</button></Link>
					{user ? (
						<>
						<Link to="/myblogs"><button type="button" className="btn btn-my">My Posts</button></Link>
						<Link to="/addblog"><button type="button" className="btn btn-add">Add Post</button></Link>
						</>
					) : (
						<>
							<Link to="/login"><button type="button" className="btn btn-login">Login</button></Link>
							<Link to="/register"><button type="button" className="btn btn-register">Register.</button></Link>
						</>
					)}
				</div>
			</div>

			<div className="navbar-center">
				<div className="navbar-title">Tizta Blog</div>
			</div>

			{user && (
				<div className="navbar-right">
					<div className="navbar-user">
						<span className="user-email">{user.email}</span>
						<button className="btn btn-signout" onClick={signout}>log out</button>
					</div>
				</div>
			)}
		</nav>
	);
}
