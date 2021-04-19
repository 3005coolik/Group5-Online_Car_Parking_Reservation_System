const jwt = require("jsonwebtoken");
const passportLocal = require("passport-local");
const LocalStrategy = passportLocal.Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcryptjs = require("bcryptjs");
const User = require("../models/Users.js");
const Owner = require("../models/Owners.js");
const axios=require('axios');
const GoogleStrategy =require('passport-google-oauth20').Strategy;
const mongoose= require('mongoose');
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
	function ownerjwtCallback(req,token, done) {
		Owner.findById(token.owner._id, function(err, user) {
			if (err) { return done(err, false); }
	  
			if (user) {
			  req.owner = user; // <= Add this line
			  done(null, user);
			} else {
			  done(null, false);
			}
		  });
	}

	function userjwtCallback(req,token, done) {
		User.findById(token.user._id, function(err, user) {
			
			if (err) { return done(err, false); }
	  
			if (user) {
			  req.user = user; // <= Add this line
			  done(null, user);
			} else {
			  done(null, false);
			}
		  });
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
				passReqToCallback: true
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
				passReqToCallback: true
			},
			ownerjwtCallback
		)
	);
	passport.use(new GoogleStrategy({
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:'/auth/google/callback'                                                                                       
    },
    async(accessToken,refreshToken,profile,done)=>{
        //console.log(profile);
        const newUser ={
            googleId:profile.id,
            email : profile.emails[0].value,
            name: profile.displayName, 
		}
         //console.log(newUser);
        try {    
            let user= await User.findOne({googleId:profile.id})
            if(user)
            {
				console.log('found!!');
                done(null,user)
            }
            else
            {
                user=await User.create(newUser)
					.then((res)=>{
                    console.log("contanct done");
					done(null,user);
                },(err)=>{
                    console.log(`posterr${err}`);
					done(null,false);
                })
						}
             
        } catch (error) {
            console.log(error);
        }
    }
    )
    )
	passport.serializeUser((user,done)=>{
        done(null,user.id)
    })

    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,user)=>done(err,user))
    })
};
