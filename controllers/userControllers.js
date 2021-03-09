const express = require("express");
const router = express.Router();
const passport = require("passport");
const ParkingLocation=require("../models/Location");

// Get user index page
router.get("/:id", async(req, res) => {
	const parkings=await ParkingLocation.find({});
	res.render("../views/user_index",{parkings,user_id:req.params.id});
});

// Get parking details
router.get('/:id/:p_id',async(req,res)=>{
    const parking=await ParkingLocation.findById(req.params.p_id);
    res.render('../views/show',{parking,user_id:req.params.id});
})

module.exports = router;
