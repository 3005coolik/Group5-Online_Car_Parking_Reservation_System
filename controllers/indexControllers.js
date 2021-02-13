const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/Users");
const Owner = require("../models/Owners");
const jwtExpirySeconds = 30000;
// GET /
router.get("/", (req, res) => {
	res.render("home");
});

// GET /register
router.get("/register", (req, res) => {
	res.render("register");
});

// GET /login
router.get("/login", (req, res) => {
	res.render("login");
});

// finds email according to category
async function registration(category, email) {
	if (category === "user") {
		return User.findOne({ email: email });
	} else {
		return Owner.findOne({ email: email });
	}
}

// POST /register
router.post("/register", (req, res) => {
	const { category, name, contact, email, password, password2 } = req.body;
	if (password !== password2) {
		res.redirect("/");
	} else {
		registration(category, email)
			.then((user) => {
				if (user) {
					res.render("register");
				} else {
					let newUser;
					if (category === "user") {
						newUser = new User({
							name,
							email,
							password,
							contact,
						});
					} else {
						newUser = new Owner({
							name,
							email,
							password,
							contact,
						});
					}
					// Hash Password
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if (err) throw err;

							// Set Password to Hash
							newUser.password = hash;
							newUser
								.save()
								.then((user) => {
									res.redirect("/login");
								})
								.catch((err) => console.log(err));
						});
					});
				}
			})
			.catch((err) => console.log(err));
	}
});

// POST /users/login
router.post("/user/login", (req, res, next) => {
	passport.authenticate("user", (err, user) => {
		if (err) {
			res.send(err);
		}
		if (!user) {
			res.redirect("/login");
		}
		req.login(user, { session: false }, async (error) => {
			if (error) {
				console.log(error);
			}
			const token = jwt.sign({ user }, process.env.ACCESS_TOKEN, {
				algorithm: "HS256",
				expiresIn: jwtExpirySeconds,
			});
			res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 });
			res.redirect(`/user/${user._id}`);
		});
	})(req, res, next);
});

//POST /owners/login
router.post("/owner/login", (req, res, next) => {
	passport.authenticate("owner", (err, owner) => {
		if (err) {
			res.send(err);
		}
		if (!owner) {
			res.redirect("/login");
		}
		req.login(owner, { session: false }, async (error) => {
			if (error) {
				console.log(error);
			}
			const token = jwt.sign({ owner }, process.env.ACCESS_TOKEN, {
				algorithm: "HS256",
				expiresIn: jwtExpirySeconds,
			});
			res.cookie("token_owner", token, {
				maxAge: jwtExpirySeconds * 1000,
			});
			res.redirect(`/owner/${owner._id}`);
		});
	})(req, res, next);
});

module.exports = router;
