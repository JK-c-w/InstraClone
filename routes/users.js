var express = require('express');
const { default: mongoose } = require('mongoose');
var router = express.Router();
mongoose.connect("mongodb://127.0.0.1:27017/instra")
var plm= require("passport-local-mongoose");

var userS= new mongoose .Schema({
    username:{
        type:String,
        default:"Userid"
    },
    bio:{
    type:String,
    default:""
},
    name:{
        type:String,
        default:"Username"
    },
    email:String,
    password:String,
    profileImage:String,
    uploads:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'postM'
    }]
})
userS.plugin(plm);
module.exports = mongoose.model("userM",userS);
