import { Link } from "react-router-dom";

export default function RegisterError() {
	return (
		<div className="container-lg mt-5">
			<div className="text-left">
				<div class="row mb-3">
					<h1>An error has occured</h1>
					<h2>Email or username is currently in use</h2>
				</div>
				<div class="mb-3">
					<div>
						<Link className="btn btn-primary" to={`/register`}>
							Try again
						</Link>{" "}
						or <Link to={`/`}>return home</Link>.
					</div>
				</div>
			</div>
		</div>
	);
}
