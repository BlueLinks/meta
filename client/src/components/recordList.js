import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";

const Record = (props) => (
	<li>
		{props.record.meta}
		<br />
		<span
			style={{ color: "LightSlateGray", display: "inline" }}
			class="d-inline-block"
		>
			<Icon.Dash />
			{props.record.submitter}
			<Link className="mx-1" to={`/edit/${props.record._id}`}>
				<Icon.PencilSquare />
			</Link>{" "}
			|
			<Link
				className="mx-1"
				onClick={() => {
					props.deleteRecord(props.record._id);
				}}
			>
				<Icon.Trash />
			</Link>
		</span>
	</li>
);

export default function RecordList() {
	const [records, setRecords] = useState([]);

	// This method fetches the records from the database.
	useEffect(() => {
		async function getRecords() {
			const response = await fetch(`http://localhost:5000/record/`);

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

	// This method will delete a record
	async function deleteRecord(id) {
		await fetch(`http://localhost:5000/${id}`, {
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
			<div class="mt-4 p-3 bg-dark text-white rounded">
				<div class="container">
					<h1 style={{ "font-family": "Cursive" }}>The Meta</h1>
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
						<div>
							<Link
								className="btn btn-primary mt-3"
								to={`/create`}
							>
								<span
									style={{ display: "inline" }}
									class="d-inline-block"
								>
									New Meta +
								</span>
							</Link>
						</div>
					</ul>
				</div>
			</div>
		</div>
	);
}
