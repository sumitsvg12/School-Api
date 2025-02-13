const mongoose=require("mongoose");

const SchoolAdminScheme=mongoose.Schema({
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


const SchoolAdmin=mongoose.model("SchoolAdmin",SchoolAdminScheme);
module.exports= SchoolAdmin;