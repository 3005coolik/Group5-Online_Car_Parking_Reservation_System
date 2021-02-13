const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const indexControllers = require("./controllers/indexControllers");
const userControllers = require("./controllers/userControllers");
const ownerControllers = require("./controllers/ownerControllers");

require("dotenv").config();

const app = express();
app.use(cookieParser());

// Passport Config
require("./config/passport")(passport);

// DB config
const db = process.env.DBURI;

// Connect to mongo
mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		const PORT = process.env.PORT || 3000;
		app.listen(PORT, console.log("Server Started"));
		console.log("Connected to DB");
	})
	.catch((err) => {
		console.log(err);
	});

// Middleware
app.use(morgan("dev"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use("/", indexControllers);
app.use(
	"/user",
	passport.authenticate("jwt_user", { session: false }),
	userControllers
);
app.use(
	"/owner",
	passport.authenticate("jwt_owner", { session: false }),
	ownerControllers
);
