import { useState, useEffect, React } from "react";
import { useNavigate } from "react-router-dom";

// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";

// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";

// Here, we display our Navbar
export default function Navbar() {
	const navigate = useNavigate();
	const [username, setUsername] = useState(null);

	useEffect(() => {
		fetch("http://localhost:5000/isUserAuth", {
			headers: {
				"x-access-token": localStorage.getItem("token"),
			},
		})
			.then((res) => res.json())
			.then((data) =>
				data.isLoggedIn ? setUsername(data.username) : null
			);
	}, []);

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
			<div className="container">
				<a className="navbar-brand" href="/">
					Meta
				</a>
				<button
					className="navbar-toggler"
					type="button"
					data-toggle="collapse"
					data-target="#navbarSupportedContent"
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>

				<div
					className="collapse navbar-collapse"
					id="navbarSupportedContent"
				>
					<ul className="navbar-nav ml-auto">
						<li className="nav-item">
							<NavLink className="nav-link" to="/">
								Home
							</NavLink>
						</li>
						{username ? (
							<>
								<li className="nav-item">
									<NavLink
										className="nav-link"
										to={"/u/" + username}
									>
										Profile
									</NavLink>
								</li>
								<li>
									<NavLink className="nav-link" to="/logout">
										Logout
									</NavLink>
								</li>
							</>
						) : (
							<>
								<li className="nav-item">
									<NavLink className="nav-link" to="/login">
										Login
									</NavLink>
								</li>
								<li className="nav-item">
									<NavLink
										className="nav-link"
										to="/register"
									>
										Register
									</NavLink>
								</li>
							</>
						)}
						{/* <li className="nav-item">
								<NavLink className="nav-link" to="/create">
									Add to the Meta
								</NavLink>
							</li> */}
					</ul>
				</div>
			</div>
		</nav>
	);
}
