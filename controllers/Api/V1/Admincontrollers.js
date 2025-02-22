

const SchoolAdmin=require("../../../models/Adminmodels");

const Faculty=require("../../../models/Facultyrmodel");
const student=require("../../../models/Studentmodels");

const jwt=require("jsonwebtoken");

const bcrypt=require("bcrypt")
const nodemailer = require("nodemailer");
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
            AdminRecordEmail.password=undefined;
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
        let perpage = 2;
        let page = 0;
        if (req.query.page) {
            page = req.query.page
        }

        let search = '';
        if (req.query.Search) {
            search = req.query.Search
        }
        let adminprofile=await SchoolAdmin.find({ $or: [
            { username: { $regex: search,$options:"i"} },
            { email: { $regex: search,$options:"i" } },
        ]
    }).skip(page * perpage).limit(perpage);

    const totalRecord = await SchoolAdmin.find({
        status: true ,
        $or: [
            { username: { $regex: search ,$options:"i"} },
            { email: { $regex: search,$options:"i" } },
        ]
    }).countDocuments()

    let totalData = (Math.ceil(totalRecord / perpage))
    
    let falsestaustsdata = await SchoolAdmin.find({ status: false });

        return res.status(200).json({ msg: "show your profile",userdata:adminprofile, deactivedata: falsestaustsdata,pageno:page,totalpage:totalData,search})
        // return res.status(200).json({ msg: "show your profile",userdata:req.user})
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

module.exports.sentverifymail=async(req,res)=>{
    try{
        let verifyemail = await SchoolAdmin.findOne({ email: req.body.email });
        // console.log(verifyemail);
        if (verifyemail) {
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

module.exports.updateforgatepassword=async(req,res)=>{
    try{
      let updatepassword=await SchoolAdmin.findOne({email:req.query.email});
    //   console.log(updatepassword);
      if(updatepassword){
           if(req.body.newpassword==req.body.confirmpassword){
             req.body.password=await bcrypt.hash(req.body.newpassword,10)
             let changepasswordsuccess=await SchoolAdmin.findByIdAndUpdate(updatepassword._id,req.body)
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
module.exports.Facltyregiterbyadmin=async(req,res)=>{
    try{
        // console.log(req.body)
        let checkemail=await Faculty.findOne({email:req.body.email});
        // console.log(checkemail)
        if(!checkemail){
             var gaspass=generatePassword();
             var link='http://localhost:9000/api'
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
                let regiterfaculty=await Faculty.create({username:req.body.username,email:req.body.email,password:gaspass})
                return res.status(200).json({msg: "email sent successfull ",regiterfaculty})  
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

function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

module.exports.showfaculty=async(req,res)=>{
   try{
    let facultydata=await Faculty.find();
    return res.status(200).json({ msg: "show your profile", Facultydata: facultydata})
   }
   catch(err){
    return res.status(400).json({ msg: "something wrong", error: err })
   }
}
module.exports.showstudent=async(req,res)=>{
    try{
     let studentdata=await student.find();
     return res.status(200).json({ msg: "show your profile", Facultydata: studentdata})
    }
    catch(err){
     return res.status(400).json({ msg: "something wrong", error: err })
    }
 }
