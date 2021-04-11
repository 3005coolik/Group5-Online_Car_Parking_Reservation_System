const { request } = require("express");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const ParkingLocation=require("../models/Location");
var Userdb=require('../models/Users');
const bcrypt = require("bcryptjs");
const BookedSlots=require('../models/BookedSlots');


// Get form for update user
router.get('/:id/update-user',(req,res)=>{
    const id=req.params.id;
    Userdb.findById(id)
        .then(userdata=>{
            if(!userdata)
            {
                res.status(404).send({message:`not found user ${id}`})
            }
            else{
               // console.log(userdata);
                res.render("update_user",{user:userdata})
            }
        })
        .catch(err=>{
            res.send(err);
        })
})

// Post for update user
router.post('/:id/update-user',(req,res)=>{
    if(!req.body)
    {
        res.status(400).send({message:"Data to update cant be empty!"});
        return;
           
    }
    const newUser=req.body;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            // Set Password to Hash
            newUser.password = hash;
            const id =req.params.id;
    Userdb.findByIdAndUpdate(id,newUser,{useFindAndModify:false})
        .then(data=>{
            if(!data)
            {
                res.status(404).send({message:`cannot update user ${id}`})
            }else{
                res.redirect(`/user/${id}`)
            }
        })
        .catch(err=>{
            res.status(500).send({message:"Error Update user information"})
        })
        });
    });
    
});
   

// Get user index page
router.get("/:id", async(req, res) => {
	const parkings=await ParkingLocation.find({});
	res.render("../views/user_index",{parkings,user_id:req.params.id});
});

// Get request for date and time entry
router.get('/:id/:p_id',async(req,res)=>{
    res.render('../views/date_time_entry',{parking_id:req.params.p_id,user_id:req.params.id});
})

// Post request for date and time entry
router.post('/:id/:p_id',async(req,res)=>{
    //console.log(req.body)
    var newStartTime=req.body.starttime;
    var newEndTime=newStartTime+req.body.dur;

    var UndesiredSlots = await BookedSlots.find()
        .where('location').eq(req.params.p_id)
        .where('vehicletype').eq(req.body.vtype)
        .where('startTime').lt(newEndTime)
        .where('endTime').gt(newStartTime)
        .exec();
    UndesiredSlots= UndesiredSlots.map((slot)=>{
        return slot.slotnumber;
    });
    req.app.set('UndesiredSlots', UndesiredSlots);
    req.app.set('vtype',{type:req.body.vtype});
    res.redirect(`/user/${req.params.id}/${req.params.p_id}/choose_slots`);    
})

// Get choosing slots form
router.get('/:id/:p_id/choose_slots',async(req,res)=> {
    
    const vtype= req.app.get('vtype');
    const Unavailable= req.app.get('UndesiredSlots');
    const curslot = await ParkingLocation.findById(req.params.p_id);
    var number,price;
    if(vtype.type==="two")
    {
        number=curslot.slot2w;
        price= curslot.price2w;
    }
    else
    {
        number=curslot.slot4w;
        price=curslot.price4w;
    }
    res.render('../views/choose_slots',{Unavailable,price,number,parking_id:req.params.p_id,user_id:req.params.id});
});

// Post request for choosing slots
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
