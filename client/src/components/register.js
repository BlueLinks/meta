import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

export default function Register() {
	const [form, setForm] = useState({
		email: "",
		username: "",
		password: "",
	});
	const navigate = useNavigate();

	// These methods will update the state properties.
	function updateForm(value) {
		return setForm((prev) => {
			return { ...prev, ...value };
		});
	}

	async function handleRegister(e) {
		e.preventDefault();
		console.log("handling register");
		const user = { ...form };
		// Make request to login route
		fetch("http://localhost:5000/register", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(user),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("heard back");
				localStorage.setItem("token", data.token);
				window.location.reload(false);
				navigate("/");
			});
		setForm({ email: "", username: "", password: "" });
	}

	useEffect(() => {
		// Check user is logged in
		fetch("http://localhost:5000/isUserAuth", {
			headers: {
				"x-access-token": localStorage.getItem("token"),
			},
		})
			.then((res) => res.json())
			.then((data) =>
				// Correct user logged in, redirect to home
				data.isLoggedIn ? navigate("/") : null
			);
	}, []);

	return (
		<div className="container-lg">
			<br />
			<h3>Register</h3>
			<form onSubmit={(event) => handleRegister(event)}>
				<div className="form-group">
					<label htmlFor="Email">Email</label>
					<input
						type="email"
						className="form-control"
						id="email"
						value={form.email}
						onChange={(e) => updateForm({ email: e.target.value })}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="Username">Username</label>
					<input
						type="text"
						className="form-control"
						id="username"
						value={form.username}
						onChange={(e) =>
							updateForm({ username: e.target.value })
						}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="Password">Password</label>
					<input
						type="password"
						className="form-control"
						id="password"
						value={form.password}
						onChange={(e) =>
							updateForm({ password: e.target.value })
						}
					/>
				</div>
				<br />
				<div className="form-group">
					<input
						type="submit"
						value="Register"
						className="btn btn-primary"
					/>
				</div>
			</form>
		</div>
	);
}
