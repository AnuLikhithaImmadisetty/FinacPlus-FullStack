const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        minLength: 2
    },
    age : {
        type: Number,
        required: true,
        min: 0,
        max: 120
    },
    dob : {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum : ["Male", "Female", "Prefer not to say", "Other"],
        required: true,
    },
    about : {
        type: String,
        maxLength: 5000
    },
    password: {
        type: String,
        required: true,
        minLength: 10,
        select : false,
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
});

const userCollection = new mongoose.model('userCollection', userSchema);

module.exports = userCollection
