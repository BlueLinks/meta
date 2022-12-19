const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config({ path: "./config.env" });
const dbURI = process.env.ATLAS_URI;
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(require("./routes/record"));
app.use(require("./routes/userAuth"));

const cors = require("cors");
app.use(cors());

const urlencondedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json(), urlencondedParser);

// get driver connection
const dbo = require("./db/conn");

// ... other imports
const path = require("path");

// ... other app.use middleware
app.use(express.static(path.join(__dirname, "client", "build")));

// ...
// Right before your app.listen(), add this:
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

mongoose.set("strictQuery", false);
mongoose
	.connect(dbURI, { useNewURLParser: true, useUnifiedTopology: true })
	.then((res) => {
		// Only listen for requests once database has loaded
		app.listen(port, () => {
			console.log("Mongoose has connected");
			dbo.connectToServer(function (err) {
				if (err) console.error(err);
			});
			console.log(`Server is running on port: ${port}`);
		});
	})
	.catch((err) => console.log(err));
