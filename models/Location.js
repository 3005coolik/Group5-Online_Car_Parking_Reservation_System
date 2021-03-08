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
    price:Number,
    description:String,
    location:String,
    owner:{
        type:Schema.Types.ObjectId,
        ref:'owner'
    }
},opts);
ParkingLocationSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/user/parkings/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});
module.exports=mongoose.model('ParkingLocation',ParkingLocationSchema);