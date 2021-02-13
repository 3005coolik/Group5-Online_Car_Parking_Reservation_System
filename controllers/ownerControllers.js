const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/:id", (req, res) => {
	res.render("owner");
});

module.exports = router;
