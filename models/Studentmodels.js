const mongoose=require("mongoose");

const StudentScheme=mongoose.Schema({
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


const Student=mongoose.model("Student",StudentScheme);
module.exports= Student;