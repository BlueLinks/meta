import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function Create() {
	const [form, setForm] = useState({
		meta: "",
		submitter: "",
	});
	const navigate = useNavigate();

	const [username, setUsername] = useState(null);

	// These methods will update the state properties.
	function updateForm(value) {
		return setForm((prev) => {
			return { ...prev, ...value };
		});
	}

	useEffect(() => {
		// Check user is logged in
		fetch("/isUserAuth", {
			headers: {
				"x-access-token": localStorage.getItem("token"),
			},
		})
			.then((res) => res.json())
			.then((data) => {
				// If user is not logged in then naviagate away
				data.isLoggedIn ? setUsername(data.username) : navigate("/");
			});
	}, []);

	// This function will handle the submission.
	async function onSubmit(e) {
		e.preventDefault();

		// When a post request is sent to the create url, we'll add a new record to the database.
		const newMeta = {
			meta: form.meta,
			submitter: username,
		};

		await fetch("/record/add", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newMeta),
		}).catch((error) => {
			window.alert(error);
			return;
		});

		setForm({ meta: "" });
		navigate("/");
	}

	// This following section will display the form that takes the input from the user.
	return (
		<div class="container-lg">
			<br />
			<h3>Add New Meta</h3>
			<form onSubmit={onSubmit}>
				<div className="form-group">
					<label htmlFor="Meta">Meta</label>
					<input
						type="text"
						className="form-control"
						id="Meta"
						value={form.meta}
						onChange={(e) => updateForm({ meta: e.target.value })}
					/>
				</div>
				<br />
				<div className="form-group">
					<input
						type="submit"
						value="Add to the meta"
						className="btn btn-primary"
					/>
				</div>
			</form>
		</div>
	);
}
