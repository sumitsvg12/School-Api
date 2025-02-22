const student=require("../../../models/Studentmodels")
const Faculty=require("../../../models/Facultyrmodel");
const SchoolAdmin=require("../../../models/Adminmodels");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer");
const { models } = require("mongoose");

module.exports.studnetlogin=async(req,res)=>{
    try {
        let studnetRecordEmail = await student.findOne({ email: req.body.email });
        // console.log(facultyRecordEmail)
        if (studnetRecordEmail) {
            console.log(req.body.password);
            console.log( studnetRecordEmail.password)
            let passwordcheck = await bcrypt.compare(req.body.password, studnetRecordEmail.password);
            //  console.log(checkpassword)
            if (passwordcheck) {
                studnetRecordEmail.password=undefined;
                let facultytoken = await jwt.sign({ StudentRecord: studnetRecordEmail }, "sumit", { expiresIn: '1d' });
                return res.status(200).json({ msg: "login success", data: facultytoken })
            }
            else {
                return res.status(200).json({ msg: "password not match" })
            }
        }
        else {
            return res.status(200).json({ msg: "invalid email" })
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "something wrong", error: err })
    }
}
module.exports.studentprofile=async(req,res)=>{
    try {
       
        return res.status(200).json({ msg: "show your profile", StudentRecord: req.user})
    }
    catch (err) {
        return res.status(400).json({ msg: "something wrong", error: err })
    }
}
module.exports.studenteditprofile=async(req,res)=>{
    try{
        let editfacultydata=await student.findById(req.params.id);
        // console.log(editadmindata)
        if(editfacultydata){
            let updatefacultydata=await student.findByIdAndUpdate(req.params.id,req.body);
            // console.log(updatedata)
            if(updatefacultydata){
                let facultyprofileupdate=await student.findById(req.params.id);
                return res.status(200).json({ msg: "user data update",data:facultyprofileupdate })
            }
            else{
                return res.status(200).json({ msg: "user data not  update" })
            }
        }
        else{
            return res.status(200).json({ msg: "user data not found " }) 
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "something wrong", error: err })
    }
}
module.exports.studentlogout=async(req,res)=>{
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
module.exports.studentpasswordchange=async(req,res)=>{
    try{
        // console.log(req.body);
        // console.log(req.user.password);
          let currentpassword=await bcrypt.compare(req.body.currentpassword,req.user.password);
          console.log(currentpassword)
          if(currentpassword){
                if(req.body.currentpassword!=req.body.newpassword){
                    if(req.body.newpassword==req.body.confirmpassword){
                        req.body.password=await bcrypt.hash(req.body.newpassword,10);
                        let updatepass=await student.findByIdAndUpdate(req.user._id,req.body)
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
module.exports.studentverifymail=async(req,res)=>{
    try{
        let emailverify = await student.findOne({ email: req.body.email });
        // console.log(verifyemail);
        if (emailverify) {
            let otp = Math.ceil(Math.random() * 1000000);
            // console.log(otp)
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, 
                auth: {
                    user: "sumitsvg2409@gmail.com",
                    pass: "eskdhutqkzqokfwf",
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            const info = await transporter.sendMail({
                from: "sumitsvg2409@gmail.com", // sender address
                to:req.body.email, // list of receivers
                subject: "verify email", // Subject line
                html: `your otp is ${otp}`, // html body
            });

            const data={
                email:req.body.email,otp
            }
            if(info){
                return res.status(200).json({msg: "email sent successfull ",data:data})  
            }
            else{
                return res.status(200).json({msg: "email not sent",data:info})
            }
        }
        else {
            return res.status(200).json({msg: "email is invalid"})
        }
    }
    catch(err){
        return res.status(400).json({ msg: "something wrong", error: err })
    }
}
module.exports.studentupdateforgatepassword=async(req,res)=>{
    try{
        let updatepassword=await student.findOne({email:req.query.email});
      //   console.log(updatepassword);
        if(updatepassword){
             if(req.body.newpassword==req.body.confirmpassword){
               req.body.password=await bcrypt.hash(req.body.newpassword,10)
               let changepasswordsuccess=await student.findByIdAndUpdate(updatepassword._id,req.body)
               if(changepasswordsuccess){
                  return res.status(200).json({ msg: "password change successfull " })
               }
               else{
                  return res.status(200).json({ msg: "password not change" })
               }
             }
             else{
              return res.status(200).json({ msg: "new password and confirmpassword not match" })
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
