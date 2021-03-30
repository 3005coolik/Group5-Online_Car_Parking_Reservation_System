const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const opts={toJSON:{virtuals:true}};

const ParkingLocationSchema=new Schema({
    title:String,
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    price2w:Number,
    slot2w:Number,
    price4w:Number,
    slot4w:Number,
    description:String,
    location:String,
    owner:{
        type:Schema.Types.ObjectId,
        ref:'owner'
    }
},opts);
ParkingLocationSchema.virtual('properties.data').get(function () {
    const obj={pid: this._id, title: this.title , description: this.description.substring(0, 20)};
    return obj;
});
module.exports=mongoose.model('ParkingLocation',ParkingLocationSchema);