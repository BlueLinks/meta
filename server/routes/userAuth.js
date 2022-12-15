const express = require("express");
const User = require("../db/models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRoutes = express.Router();

function loginUser(req, res) {
	const userLoggingIn = req.body;
	console.log("attempting to login user: " + userLoggingIn.username);
	// Check if username is in the database
	// Use .then as findOne returns promise
	User.findOne({ username: userLoggingIn.username }).then((dbUser) => {
		if (!dbUser) {
			console.log("No user found");
			return res.json({
				// No user with given username in database
				message: "Invalid Username or Password",
			});
		}
		// Check if hashed given password matches the hash in the database
		bcrypt
			.compare(userLoggingIn.password, dbUser.password)
			.then((isCorrect) => {
				if (isCorrect) {
					console.log("password is correct");
					// Create payload for token
					// Payload is information you get back once jwt is decoded
					const payload = {
						id: dbUser._id,
						username: dbUser.username,
					};
					// Create token
					jwt.sign(
						payload,
						// Secret key used for encryption
						process.env.JWT_SECRET,
						// How long before token expires
						// 86400 secs == 1 day
						{ expiresIn: 86400 },
						(err, token) => {
							if (err) {
								console.log(err);
								return res.json({ message: err });
							}
							console.log("attempting to return");
							// send token to front end
							return res.json({
								message: "Success",
								token: "Bearer " + token,
							});
						}
					);
				} else {
					console.log("password hash is incorrect");
					return res.json({
						message: "Invalid Username or Password",
					});
				}
			});
	});
}

authRoutes.route("/register").post(async function (req, res) {
	console.log("Attempting to register new user.");
	const user = Object.assign({}, req.body);

	// Check if username or email has been taken by another user already
	const takenUsername = await User.findOne({ username: user.username });
	const takenEmail = await User.findOne({ email: user.email });

	if (takenUsername || takenEmail) {
		res.json({ message: "Username or email has already been taken" });
	} else {
		// hash password
		user.password = await bcrypt.hash(user.password, 10);

		// Create user object and save to db
		const dbUser = new User({
			username: user.username.toLowerCase(),
			email: user.email.toLowerCase(),
			password: user.password,
		});

		await dbUser.save();
		console.log("Saved new user.");
		console.log(req.body.password);
		return loginUser(req, res);
	}
});

authRoutes.route("/login").post(async function (req, res) {
	console.log("Attempting to login user.");
	return loginUser(req, res);
});

authRoutes.get("/isUserAuth", verifyJWT, (req, res) => {
	res.json({ isLoggedIn: true, username: req.user.username });
});

authRoutes.get("/logout", (req, res) => {
	res.json({ isLoggedIn: true, username: req.user.username });
});

function verifyJWT(req, res, next) {
	console.log("Verifying JTW");
	const token = req.headers["x-access-token"]?.split(" ")[1];

	if (token) {
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err)
				return res.json({
					isLoggedIn: false,
					message: "Failed To Authenticate",
				});
			req.user = {};
			req.user.id = decoded.id;
			req.user.username = decoded.username;
			next();
		});
	} else {
		res.json({ message: "Incorrect Token Given", isLoggedIn: false });
	}
}

module.exports = authRoutes;
