const express = require("express");
const router = express.Router();
const passport = require("passport");
const ParkingLocation=require("../models/Location")
router.get("/parkings", async(req, res) => {
	//console.log(req.user);
	const parkings=await ParkingLocation.find({});
	res.render("../views/index",{parkings});
	
});
router.get('/parkings/:p_id',async(req,res)=>{
    const parking=await ParkingLocation.findById(req.params.p_id);
    res.render('../views/show',{parking});
})

module.exports = router;
