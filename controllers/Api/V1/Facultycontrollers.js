const Faculty = require("../../../models/Facultyrmodel")
const student=require("../../../models/Studentmodels");
const SchoolAdmin=require("../../../models/Adminmodels");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer");


module.exports.facultylogin = async (req, res) => {
    try {
        let facultyRecordEmail = await Faculty.findOne({ email: req.body.email });
        // console.log(facultyRecordEmail)
        if (facultyRecordEmail) {
            console.log(req.body.password);
            console.log( facultyRecordEmail.password)
            let passwordcheck = await bcrypt.compare(req.body.password, facultyRecordEmail.password);
            //  console.log(checkpassword)
            if (passwordcheck) {
                facultyRecordEmail.password=undefined;
                let facultytoken = await jwt.sign({ Facultydata: facultyRecordEmail }, "svg", { expiresIn: '1d' });
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
module.exports.facultyprofile = async (req, res) => {
    try {
       
        return res.status(200).json({ msg: "show your profile", Facultydata: req.user})
    }
    catch (err) {
        return res.status(400).json({ msg: "something wrong", error: err })
    }
}

module.exports.facultyeditprofile=async(req,res)=>{
    try{
        let editfacultydata=await Faculty.findById(req.params.id);
        // console.log(editadmindata)
        if(editfacultydata){
            let updatefacultydata=await Faculty.findByIdAndUpdate(req.params.id,req.body);
            // console.log(updatedata)
            if(updatefacultydata){
                let facultyprofileupdate=await Faculty.findById(req.params.id);
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
module.exports.facultylogout=async(req,res)=>{
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
module.exports.faclutypasswordchange=async(req,res)=>{
    try{
        // console.log(req.body);
        // console.log(req.user.password);
          let currentpassword=await bcrypt.compare(req.body.currentpassword,req.user.password);
          console.log(currentpassword)
          if(currentpassword){
                if(req.body.currentpassword!=req.body.newpassword){
                    if(req.body.newpassword==req.body.confirmpassword){
                        req.body.password=await bcrypt.hash(req.body.newpassword,10);
                        let updatepass=await Faculty.findByIdAndUpdate(req.user._id,req.body)
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
module.exports.facultyverifymail=async(req,res)=>{
    try{
        let emailverify = await Faculty.findOne({ email: req.body.email });
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
module.exports.facultyupdateforgatepassword=async(req,res)=>{
    try{
        let updatepassword=await Faculty.findOne({email:req.query.email});
      //   console.log(updatepassword);
        if(updatepassword){
             if(req.body.newpassword==req.body.confirmpassword){
               req.body.password=await bcrypt.hash(req.body.newpassword,10)
               let changepasswordsuccess=await Faculty.findByIdAndUpdate(updatepassword._id,req.body)
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
module.exports.studentregiterbyfaculty=async(req,res)=>{
    try{
        // console.log(req.body)
        let emailcheck=await student.findOne({email:req.body.email});
        // console.log(emailcheck)
        if(!emailcheck){
             var gaspass=Passwordgenerate();
             var link='http://localhost:9000/api/faculty'
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
                subject: "check your login detail", // Subject line
                html: `<h1>check your detail for login</h1><p>show your email id:${req.body.email}</p><p>show your password:${gaspass}</p><p>for login click here:${link}</p>`, 
            });

            if(info){
                gaspass=await bcrypt.hash(gaspass,10)
                let regiterstudent=await student.create({username:req.body.username,email:req.body.email,password:gaspass})
                return res.status(200).json({msg: "email sent successfull ",regiterstudent})  
            }
            else{
                return res.status(200).json({msg: "email not sent",data:data})
            }

        }
        else{
            return res.status(200).json({ msg: "email is already regiter" }) ; 
        }
    }
    catch(err){
        return res.status(400).json({ msg: "something wrong", error: err })
    } 
}
function Passwordgenerate() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}