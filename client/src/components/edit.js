import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

export default function Edit() {
	const [form, setForm] = useState({
		meta: "",
		submitter: "",
	});
	const params = useParams();
	const navigate = useNavigate();
	const [username, setUsername] = useState(null);
	const [owner, setOwner] = useState(null);

	function checkCorrectUser(owner) {
		// Check user is logged in
		fetch("http://localhost:5000/isUserAuth", {
			headers: {
				"x-access-token": localStorage.getItem("token"),
			},
		})
			.then((res) => res.json())
			.then((data) => {
				// If user is not logged in then naviagate away
				data.isLoggedIn && data.username == owner
					? setUsername(data.username)
					: navigate("/");
			});
	}

	useEffect(() => {
		async function fetchData() {
			const id = params.id.toString();
			const response = await fetch(
				`http://localhost:5000/record/${params.id.toString()}`
			);

			if (!response.ok) {
				const message = `An error has occurred: ${response.statusText}`;
				window.alert(message);
				return;
			}

			const record = await response.json();
			if (!record) {
				window.alert(`Record with id ${id} not found`);
				navigate("/");
				return;
			}
			setForm(record);
			setOwner(record.submitter);
			checkCorrectUser(record.submitter);
		}

		fetchData();

		return;
	}, [params.id, navigate]);

	useEffect(() => {}, []);

	// These methods will update the state properties.
	function updateForm(value) {
		return setForm((prev) => {
			return { ...prev, ...value };
		});
	}

	async function onSubmit(e) {
		e.preventDefault();
		if ((owner = username)) {
			const editedMeta = {
				meta: form.meta,
				submitter: username,
			};

			// This will send a post request to update the data in the database.
			await fetch(`http://localhost:5000/update/${params.id}`, {
				method: "POST",
				body: JSON.stringify(editedMeta),
				headers: {
					"Content-Type": "application/json",
				},
			});
			navigate("/");
		}
	}

	// This following section will display the form that takes input from the user to update the data.
	return (
		<div class="container-lg">
			<br />
			<h3>Update Record</h3>
			<form onSubmit={onSubmit}>
				<div className="form-group">
					<label htmlFor="meta">Meta: </label>
					<input
						type="text"
						className="form-control"
						id="meta"
						value={form.meta}
						onChange={(e) => updateForm({ meta: e.target.value })}
					/>
				</div>
				<br />

				<div className="form-group">
					<input
						type="submit"
						value="Update Record"
						className="btn btn-primary"
					/>
				</div>
			</form>
		</div>
	);
}
