const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/Users");
const Owner = require("../models/Owners");
const axios=require('axios');
const GoogleStrategy =require('passport-google-oauth20').Strategy;
 
const jwtExpirySeconds = 30000;
// GET home page
router.get("/", (req, res) => {
	res.render("home");
});

// GET register form
router.get("/register", (req, res) => {
	res.render("register");
});

//GET google Register 
router.get('/auth/google',passport.authenticate('google',{scope: 'profile email'}))	

//callback from google API
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/'}),(req,res)=>{
	const user=req.user;
	if (!user) {
		res.redirect("/login");
	}
	//console.log(user);
	req.login(user, { session: false }, async (error) => {
		if (error) {
			console.log(error);
		}
		//req.user=user;
		
		const token = jwt.sign({ user }, process.env.ACCESS_TOKEN, {
			algorithm: "HS256",
			expiresIn: jwtExpirySeconds,
		});
		res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 });
		res.redirect(`/user/${user._id}`);
	});
})

// GET login form
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
			return;
		}
		if (!user) {
			res.redirect("/login");
			return;
		}
		req.login(user, { session: false }, async (error) => {
			if (error) {
				console.log(error);
			}
			//req.user=user;
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
			return;
		}
		if (!owner) {
			res.redirect("/login");
			return;
		}
		req.login(owner, { session: false }, async (error) => {
			if (error) {
				console.log(error);
			}
			//req.owner=owner;
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

// GET on /users/logout
router.get("/users/logout", (req, res) => {
	if(req.cookies && req.cookies.hasOwnProperty("token")) {
		res.cookie("token","",{expires: new Date(0)});
	}
	res.redirect("/");
})

//GET on /owners/logout
router.get("/owners/logout", (req, res) => {
	if(req.cookies && req.cookies.hasOwnProperty("token_owner")) {
		res.cookie("token_owner","",{expires: new Date(0)});
	}
	res.redirect("/");
})

module.exports = router;
