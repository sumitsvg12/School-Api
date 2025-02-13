

const SchoolAdmin=require("../../../models/Adminmodels");

const jwt=require("jsonwebtoken");

const bcrypt=require("bcrypt")

module.exports.SchoolAddAdmin=async(req,res)=>{
    try{
        let isAdminExit= await SchoolAdmin.findOne({ email: req.body.email });
        if (!isAdminExit) {
            if (req.body.password == req.body.conformpaasword) {
                req.body.password=await bcrypt.hash(req.body.password,10)
                let AdminRegiter= await SchoolAdmin.create(req.body);
                if (AdminRegiter) {
                    return res.status(200).json({ msg: "Admin regiter successfull", data: AdminRegiter })
                }
                else {
                    return res.status(200).json({ msg: "Admin regiter not success"});
                }
            }
            else {
                return res.status(200).json({ msg: "password and conformpassword not match" });
            }
        }
        else {
            return res.status(200).json({ msg: "email is already exit" });
        }
    }
    catch(err){
        return res.status(400).json({ msg: "something wrong", error: err })
    }
}
module.exports.SchoolAdminLogin=async(req,res)=>{
    try{
        let AdminRecordEmail=await SchoolAdmin.findOne({email:req.body.email});
        if(AdminRecordEmail){
         let checkpassword=await bcrypt.compare(req.body.password,AdminRecordEmail.password);
        //  console.log(checkpassword)
         if(checkpassword){
             let token=await jwt.sign({userdata:AdminRecordEmail},"rnw",{ expiresIn: '1d' });
             return res.status(200).json({ msg: "login success", data:token })
         }
         else{
             return res.status(200).json({ msg: "password not match"})
         }
        }
        else{
         return res.status(200).json({ msg: "invalid email" })
        }
    }
    catch(err){
        return res.status(400).json({ msg: "something wrong", error: err })
    }
}
module.exports.adminprofile=async(req,res)=>{
    try{
        return res.status(200).json({ msg: "show your profile",userdata:req.user})
    }
    catch(err){
        return res.status(400).json({ msg: "something wrong", error: err })
    }
}
module.exports.admineditprofile=async(req,res)=>{
    try{
        // console.log(req.body);
        let editadmindata=await SchoolAdmin.findById(req.params.id);
        // console.log(editadmindata)
        if(editadmindata){
            let updatedata=await SchoolAdmin.findByIdAndUpdate(req.params.id,req.body);
            // console.log(updatedata)
            if(updatedata){
                let adminprofileupdate=await SchoolAdmin.findById(req.params.id);
                return res.status(200).json({ msg: "user data update",data:adminprofileupdate })
            }
            else{
                return res.status(200).json({ msg: "user data not  update" })
            }
        }
        else{
            return res.status(200).json({ msg: "user data not found " }) 
        }
    }
    catch(err){
        return res.status(400).json({ msg: "something wrong", error: err })
    } 
}
module.exports.adminlogout=async(req,res)=>{
    try{
        req.session.destroy ((err)=>{
         if(err){
            return res.status(400).json({ msg: "something wrong please check" })
         }
         else{
            return res.status(200).json({ msg: "go to login page" }) 
         }
        })
    } 
    catch(err){
        return res.status(400).json({ msg: "something wrong", error: err })
    }
}
module.exports.changepassword=async(req,res)=>{
    try{
        // console.log(req.user.password)
          let checkcurrentpassword=await bcrypt.compare(req.body.currentpassword,req.user.password);
        //   console.log(checkcurrentpassword)
          if(checkcurrentpassword){
                if(req.body.currentpassword!=req.body.newpassword){
                    if(req.body.newpassword==req.body.confirmpassword){
                        req.body.password=await bcrypt.hash(req.body.newpassword,10);
                        let updatepass=await SchoolAdmin.findByIdAndUpdate(req.user._id,req.body)
                        if(updatepass){
                            return res.status(200).json({ msg: "user password update" }) 
                        }
                        else{
                            return res.status(200).json({ msg: "user password  not update" }) 
                        }
                    }
                    else{
                        return res.status(200).json({ msg: "new password and confirm password not match" }) 
                    }
                }
                else{
                    return res.status(200).json({ msg: "current password and new password are match" })  
                }
          }
          else{
            return res.status(200).json({ msg: "current password is not match" })  
          }
    }
    catch(err){
        return res.status(400).json({ msg: "something wrong", error: err })
    }
}

