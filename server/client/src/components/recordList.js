import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";

export default function RecordList() {
	const [username, setUsername] = useState(null);
	const [records, setRecords] = useState([]);

	const Record = (props) => (
		<li>
			{props.record.meta}
			<br />
			<span
				style={{ color: "LightSlateGray", display: "inline" }}
				className="d-inline-block"
			>
				<Icon.Dash />
				{props.record.submitter}
				{props.record.submitter == username ? (
					<span>
						(
						<Link className="mx-1" to={`/edit/${props.record._id}`}>
							<Icon.PencilSquare />
						</Link>
						|
						<Link
							className="mx-1"
							onClick={() => {
								props.deleteRecord(props.record._id);
							}}
						>
							<Icon.Trash />
						</Link>
						){" "}
					</span>
				) : (
					<></>
				)}
			</span>
		</li>
	);

	// This method fetches the records from the database.
	useEffect(() => {
		async function getRecords() {
			const response = await fetch(`/record`, {
				mode: "cors",
			});

			if (!response.ok) {
				const message = `An error occurred: ${response.statusText}`;
				window.alert(message);
				return;
			}

			const records = await response.json();
			setRecords(records);
			document.getElementById("metaList").style.display = "block";
			document.getElementById("tableLoading").style.display = "none";
		}

		getRecords();

		return;
	}, [records.length]);

	useEffect(() => {
		fetch("/isUserAuth", {
			headers: {
				"x-access-token": localStorage.getItem("token"),
			},
		})
			.then((res) => res.json())
			.then((data) =>
				data.isLoggedIn ? setUsername(data.username) : null
			);
	}, []);

	// This method will delete a record
	async function deleteRecord(id) {
		await fetch(`/${id}`, {
			method: "DELETE",
		});

		const newRecords = records.filter((el) => el._id !== id);
		setRecords(newRecords);
	}

	// This method will map out the records on the table
	function recordList() {
		return records.map((record) => {
			return (
				<Record
					record={record}
					deleteRecord={() => deleteRecord(record._id)}
					key={record._id}
				/>
			);
		});
	}

	// This following section will display the table with the records of individuals.
	return (
		<div className="container mt-3">
			<div className="mt-4 p-3 bg-dark text-white rounded">
				<div className="container">
					<h1 style={{ fontFamily: "Cursive" }}>The Meta</h1>
					<hr></hr>
					<div className="text-center">
						<div
							id="tableLoading"
							className="spinner-border m-5"
							role="status"
						></div>
					</div>
					<ul id="metaList">
						{recordList()}
						{username ? (
							<div>
								<Link
									className="btn btn-primary mt-3"
									to={`/create`}
								>
									<span
										style={{ display: "inline" }}
										className="d-inline-block"
									>
										New Meta +
									</span>
								</Link>
							</div>
						) : (
							<></>
						)}
					</ul>
				</div>
			</div>
		</div>
	);
}
