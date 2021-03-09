const express = require("express");
const router = express.Router();
const passport = require("passport");
const ParkingLocation=require("../models/Location")
const Owner=require("../models/Owners")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken=process.env.MAPBOX_TOKEN;

//console.log(mapBoxToken);
const geocoder=mbxGeocoding({accessToken:mapBoxToken});

// Get all parking of current owner
router.get('/:id',async(req,res)=>{
	const id=req.params.id
    const parkings=await ParkingLocation.find({owner:id});
    const owner=await Owner.findById(id);
    res.render('parkings/index',{parkings,id,owner});
})

// Get form to add new parking
router.get('/:id/newParking',(req,res)=>{
    const id=req.params.id;
	res.render('parkings/new',{id});
})

// post request to save new parking
router.post('/:id',async(req,res)=>{
    //console.log(req.body);
    const GeoData=await geocoder.forwardGeocode({
        query:req.body.parking.location,
        limit:1
    }).send()
    const parking =new ParkingLocation(req.body.parking);
    parking.geometry=GeoData.body.features[0].geometry;
    parking.owner=req.owner._id;
    await parking.save();
    res.redirect(`/owner/${req.owner._id}`);
})

// Get parking details 
router.get('/:id/:p_id',async(req,res)=>{
    const parking=await ParkingLocation.findById(req.params.p_id);
	const id=req.params.id;
    res.render('parkings/show',{parking,id});
})

module.exports = router;
