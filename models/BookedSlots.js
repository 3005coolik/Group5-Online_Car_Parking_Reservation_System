const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const bookedslotSchema = new Schema({
    location:{
        type:Schema.Types.ObjectId,
        ref:'location'
    },
    slotnumber:{
        type: Number,
        required: true
    },
    starttime:{
        type:Number, 
        required: true
    },
    endtime:{
        type:Number,
        required: true
    },
    vehiclenumber:{
        type:String,
        required: false
    },
    vehicletype: {
        type:String,
        required: false
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'user'
    }
})
const BookedSlot = mongoose.model("bookedslot",bookedslotSchema);

module.exports = BookedSlot;