const jwt = require("jsonwebtoken");
const passportLocal = require("passport-local");
const LocalStrategy = passportLocal.Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcryptjs = require("bcryptjs");
const User = require("../models/Users.js");
const Owner = require("../models/Owners.js");
require("dotenv").config();

function userStrategy(email, password, done) {
	// Match User
	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				return done(null, false, { message: "Email not registered" });
			}
			// Match Password
			bcryptjs.compare(password, user.password, (err, isMatch) => {
				if (err) {
					throw err;
				}
				if (isMatch) {
					return done(null, user, { message: "Login successful" });
				} else {
					return done(null, false, { message: "Incorrect Password" });
				}
			});
		})
		.catch((err) => {
			console.log(err);
		});
}

function ownerStrategy(email, password, done) {
	// Match Owner
	Owner.findOne({ email: email })
		.then((owner) => {
			if (!owner) {
				return done(null, false, { message: "Email not registered" });
			}
			// Match Password
			bcryptjs.compare(password, owner.password, (err, isMatch) => {
				if (err) {
					throw err;
				}
				if (isMatch) {
					return done(null, owner, { message: "Login successful" });
				} else {
					return done(null, false, { message: "Incorrect Password" });
				}
			});
		})
		.catch((err) => {
			console.log(err);
		});
}

module.exports = function (passport) {
	var usercookieExtractor = function (req) {
		var token = null;
		if (req) {
			token = req.cookies.token;
		}
		return token;
	};
	var ownercookieExtractor = function (req) {
		var token = null;
		if (req) {
			token = req.cookies.token_owner;
		}
		return token;
	};
	function ownerjwtCallback(token, done) {
		try {
			done(null, token.owner);
		} catch (error) {
			console.log(error);
			done(error);
		}
	}
	function userjwtCallback(token, done) {
		try {
			done(null, token.user);
		} catch (error) {
			console.log(error);
			done(error);
		}
	}
	passport.use(
		"user",
		new LocalStrategy({ usernameField: "email" }, userStrategy)
	);
	passport.use(
		"owner",
		new LocalStrategy({ usernameField: "email" }, ownerStrategy)
	);
	passport.use(
		"jwt_user",
		new JWTStrategy(
			{
				secretOrKey: process.env.ACCESS_TOKEN,
				jwtFromRequest: ExtractJWT.fromExtractors([usercookieExtractor]),
			},
			userjwtCallback
		)
	);
	passport.use(
		"jwt_owner",
		new JWTStrategy(
			{
				secretOrKey: process.env.ACCESS_TOKEN,
				jwtFromRequest: ExtractJWT.fromExtractors([ownercookieExtractor]),
			},
			ownerjwtCallback
		)
	);
};
