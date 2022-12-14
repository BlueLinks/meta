import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Record = (props) => (
	<tr>
		<td>{props.record.meta}</td>
		<td>{props.record.submitter}</td>
		<td>
			<Link className="btn btn-link" to={`/edit/${props.record._id}`}>
				Edit
			</Link>{" "}
			|
			<button
				className="btn btn-link"
				onClick={() => {
					props.deleteRecord(props.record._id);
				}}
			>
				Delete
			</button>
		</td>
	</tr>
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
			document.getElementById("metaTable").style.display = "block";
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
		<div className="container-lg">
			<div className="text-center">
				<div
					id="tableLoading"
					className="spinner-border m-5"
					role="status"
				></div>
			</div>
			<table
				id="metaTable"
				className="table table-striped table-dark"
				style={{ marginTop: 20 }}
			>
				<thead>
					<tr>
						<th className="col-sm-3">Meta</th>
						<th className="col-sm-1">Submitter</th>
						<th className="col-sm-1">Action</th>
					</tr>
				</thead>
				<tbody>{recordList()}</tbody>
			</table>
			<div className="col text-center">
				<Link className="btn btn-primary btn-lg col-6" to={`/create`}>
					Add to Meta
				</Link>
			</div>
		</div>
	);
}
