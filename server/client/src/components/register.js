import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

export default function Register() {
	const [form, setForm] = useState({
		email: "",
		username: "",
		password: "",
		confirmPassword: "",
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

	const validateInput = (input) => {
		return String(input).match(/^[0-9a-z]{4,32}$/);
	};

	async function handleRegister(e) {
		e.preventDefault();
		const user = { ...form };
		// Make request to login route
		fetch("/register", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(user),
		})
			.then((res) => {
				if (!res.ok) {
					navigate("/register_error");
				}
				return res.json();
			})
			.then((data) => {
				localStorage.setItem("token", data.token);
				window.location.reload(false);
				navigate("/");
			});
		setForm({ email: "", username: "", password: "", confirmPassword: "" });
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

	useEffect(() => {
		const user = { ...form };
		if (
			validateEmail(user.email) &&
			validateInput(user.username) &&
			validateInput(user.password) &&
			user.password == user.confirmPassword
		) {
			document.getElementById("submissionButton").className =
				"btn btn-primary";
		} else {
			document.getElementById("submissionButton").className =
				"btn btn-secondary disabled";
		}
	}, [form]);

	return (
		<div className="container-sm mt-3">
			<div className="mt-4 p-3 bg-dark text-white rounded">
				<div className="container">
					<h1>Register</h1>
					<hr></hr>
					<form onSubmit={(event) => handleRegister(event)}>
						<div className="row mb-3">
							<label
								htmlFor="Email"
								className="col-sm-2 col-form-label"
							>
								Email
							</label>
							<div className="col-sm">
								<input
									type="email"
									className="form-control"
									id="email"
									value={form.email}
									onChange={(e) => {
										updateForm({
											email: e.target.value,
										});
										validateEmail(e.target.value)
											? (document.getElementById(
													"email"
											  ).className =
													"form-control is-valid")
											: (document.getElementById(
													"email"
											  ).className =
													"form-control is-invalid");
									}}
								/>
								<div className="invalid-feedback">
									This is not a valid email address
								</div>
							</div>
						</div>
						<div className="row mb-3">
							<label
								htmlFor="Username"
								className="col-sm-2 col-form-label"
							>
								Username
							</label>
							<div className="col-sm">
								<input
									type="text"
									className="form-control"
									id="username"
									value={form.username}
									onChange={(e) => {
										updateForm({
											username: e.target.value,
										});
										validateInput(e.target.value)
											? (document.getElementById(
													"username"
											  ).className =
													"form-control is-valid")
											: (document.getElementById(
													"username"
											  ).className =
													"form-control is-invalid");
									}}
								/>
								<div className="invalid-feedback">
									This is not a valid Username. Must be
									alphanumeric and contain between 4 and 32
									characters.
								</div>
							</div>
						</div>
						<div className="row mb-3">
							<label
								htmlFor="Password"
								className="col-sm-2 col-form-label"
							>
								Password
							</label>
							<div className="col-sm">
								<input
									type="password"
									className="form-control"
									id="password"
									value={form.password}
									onChange={(e) => {
										updateForm({
											password: e.target.value,
										});
										validateInput(e.target.value)
											? (document.getElementById(
													"password"
											  ).className =
													"form-control is-valid")
											: (document.getElementById(
													"password"
											  ).className =
													"form-control is-invalid");
									}}
								/>
								<div className="invalid-feedback">
									This is not a valid Password. Must be
									alphanumeric and contain between 4 and 32
									characters.
								</div>
							</div>
						</div>
						<div className="row mb-3">
							<label
								htmlFor="confirmPassword"
								className="col-sm-2 col-form-label"
							>
								Confirm Password
							</label>
							<div className="col-sm">
								<input
									type="password"
									className="form-control"
									id="confirmPassword"
									value={form.confirmPassword}
									onChange={(e) => {
										updateForm({
											confirmPassword: e.target.value,
										});
										e.target.value == form.password
											? (document.getElementById(
													"confirmPassword"
											  ).className =
													"form-control is-valid")
											: (document.getElementById(
													"confirmPassword"
											  ).className =
													"form-control is-invalid");
									}}
								/>
								<div className="invalid-feedback">
									Password must match.
								</div>
							</div>
						</div>
						<br />
						<div className="row mb-3">
							<input
								type="submit"
								id="submissionButton"
								value="Register"
								className="btn btn-secondary disabled"
							/>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
