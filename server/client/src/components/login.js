import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";

export default function Login() {
	const [form, setForm] = useState({
		email: "",
		password: "",
	});
	const navigate = useNavigate();

	// These methods will update the state properties.
	function updateForm(value) {
		return setForm((prev) => {
			return { ...prev, ...value };
		});
	}

	const validateEmail = (email) => {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	};

	async function handleLogin(e) {
		e.preventDefault();
		const user = { ...form };
		if (!validateEmail(user.email)) {
			user.username = user.email;
		}

		// Make request to login route
		fetch("/login", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(user),
		})
			.then((res) => {
				if (!res.ok) {
					navigate("/login_error");
				}
				return res.json();
			})
			.then((data) => {
				localStorage.setItem("token", data.token);
				navigate(0);
			});
		setForm({ email: "", password: "" });
	}

	useEffect(() => {
		// Check user is logged in
		fetch("/isUserAuth", {
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
		<div className="container-sm mt-3">
			<div className="mt-4 p-3 bg-dark text-white rounded">
				<div className="container">
					<h1>Login</h1>
					<hr></hr>
					<form onSubmit={(event) => handleLogin(event)}>
						<div className="row mb-3">
							<label
								className="col-sm-2 col-form-label"
								htmlFor="Email"
							>
								Email / Username
							</label>
							<div className="col-sm">
								<input
									type="string"
									className="form-control"
									id="email"
									value={form.email}
									onChange={(e) =>
										updateForm({ email: e.target.value })
									}
								/>
							</div>
						</div>
						<div className="row mb-3">
							<label
								className="col-sm-2 col-form-label"
								htmlFor="Password"
							>
								Password
							</label>
							<div className="col-sm">
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
						</div>
						<br />
						<div className="row mb-3">
							<input
								type="submit"
								value="Login"
								className="btn btn-primary"
							/>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
