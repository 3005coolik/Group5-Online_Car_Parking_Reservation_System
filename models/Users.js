const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userObj = {
    email: {type: String, require:true},
    name: {type: String, require:true},
    contact: {type: String, require:true},
    password: {type: String, require:true},
    dateRegistered: {type: Date, default: Date.now()}
};

const userSchema = new Schema(userObj,{timestamps:true});
const User = mongoose.model("user",userSchema);

module.exports = User;