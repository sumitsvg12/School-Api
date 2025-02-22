const express=require("express")

const routes=express.Router();

const Faculty=require("../../../../models/Facultyrmodel");

const facultyctlr=require("../../../../controllers/Api/V1/Facultycontrollers");

const passport=require("passport");



routes.post("/facultylogin",facultyctlr.facultylogin);
routes.get("/facultyprofile",passport.authenticate('faculty',{failureRedirect:"/api/faculty/unauthfac"}),facultyctlr.facultyprofile);
routes.get("/unauthfac",async(req,res)=>{
    return res.status(400).json({msg:"user are not authorise "});
})
routes.put("/facultyeditprofile/:id",passport.authenticate('faculty',{failureRedirect:"/api/faculty/unauthfac"}),facultyctlr.facultyeditprofile);
routes.get("/facultylogout",passport.authenticate('faculty',{failureRedirect:"/api/faculty/unauthfac"}),facultyctlr.facultylogout);
routes.post("/faclutypasswordchange",passport.authenticate('faculty',{failureRedirect:"/api/faculty/unauthfac"}),facultyctlr.faclutypasswordchange);
routes.post("/facultyverifymail",facultyctlr.facultyverifymail);
routes.post("/facultyupdateforgatepassword",facultyctlr.facultyupdateforgatepassword);
routes.post("/studentregiterbyfaculty",passport.authenticate('faculty',{failureRedirect:"/api/faculty/unauthfac"}),facultyctlr.studentregiterbyfaculty);
module.exports=routes;