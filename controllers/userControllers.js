const { request } = require("express");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const ParkingLocation=require("../models/Location");
const BookedSlots=require('../models/BookedSlots');

// Get user index page
router.get("/:id", async(req, res) => {
	const parkings=await ParkingLocation.find({});
	res.render("../views/user_index",{parkings,user_id:req.params.id});
});

// Get parking details
router.get('/:id/:p_id',async(req,res)=>{
    const parking=await ParkingLocation.findById(req.params.p_id);
    res.render('../views/date_time_entry',{parking,user_id:req.params.id});
})

router.post('/:id/:p_id',async(req,res)=>{
    console.log(req.body)
    var newStartTime=req.body.starttime;
    var newEndTime=newStartTime+req.body.dur;
    var UndesiredSlots = await BookedSlots.find()
        .where('location').eq(req.params.p_id)
        .where('startTime').lt(newEndTime)
        .where('endTime').gt(newStartTime)
        .exec();

    req.app.set('Slotss', UndesiredSlots);
    res.redirect(`/user/${req.params.id}/${req.params.p_id}/choose_slots`);    
})

router.get('/:id/:p_id/choose_slots',async(req,res)=> {
    console.log(req.app.get('Slotss'));
    const myslotn = await ParkingLocation.findById(req.params.p_id);
    const number = myslotn.slot4w;
    console.log(myslotn);
    // const number = 40;
    res.render('../views/choose_slots',{Unavailable:req.app.get('Slotss'),number});
});

router.post('/:id/:p_id/choose_slots', async(req,res)=> {
    console.log(req.body)
    const Slots = new BookedSlot({
        // location: await ParkingLocation.findById(req.params.p_id).location,
    }) ;

    Slots.save()
        .then((result) =>{
            res.send(result)
        })
        .catch((err) => {
            console.log(err);
        });
})



module.exports = router;
