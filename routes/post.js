const mongoose =require('mongoose');
const postS= new mongoose.Schema({
    userid:{
         type: mongoose.Schema.Types.ObjectId,
         ref:'userM'
    },
    image:String,
    desc:String,
})

module.exports=mongoose.model("postM",postS);