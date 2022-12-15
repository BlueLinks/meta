import { useState, useEffect, React } from "react";
import { Link } from "react-router-dom";

export default function Logout() {
	const [username, setUsername] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			console.log("Logging user out");
			localStorage.removeItem("token");
			setUsername(null);
			window.location.reload(false);
		}
	}, []);

	return (
		<div className="container-lg mt-5">
			<div className="text-left">
				<div class="row mb-3">
					<h1>You have been signed out</h1>
				</div>
				<div class="mb-3">
					<div>
						<Link className="btn btn-primary" to={`/`}>
							Continue
						</Link>{" "}
						or <Link to={`/login`}>log in</Link> again.
					</div>
				</div>
			</div>
		</div>
	);
}
