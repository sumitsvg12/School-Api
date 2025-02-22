const mongoose=require("mongoose");

const FacultyScheme=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }, 
    status:{
        type:Boolean,
        default:true,
    }
},{
    timeStamps:true,
});


const Faculty=mongoose.model("Faculty",FacultyScheme);
module.exports= Faculty;