const express=require("express")

const routes=express.Router();

const student=require("../../../../models/Studentmodels");

const studentctrl=require("../../../../controllers/Api/V1/Studentcontrollers");

const passport=require("passport");

routes.post("/studnetlogin",studentctrl.studnetlogin);
routes.get("/studentprofile",passport.authenticate('student',{failureRedirect:"/api/student/unauthstudent"}),studentctrl.studentprofile);
routes.put("/studenteditprofile/:id",passport.authenticate('student',{failureRedirect:"/api/student/unauthstudent"}),studentctrl.studenteditprofile);
routes.get("/studentlogout",passport.authenticate('student',{failureRedirect:"/api/student/unauthstudent"}),studentctrl.studentlogout);
routes.post("/studentpasswordchange",passport.authenticate('student',{failureRedirect:"/api/student/unauthstudent"}),studentctrl.studentpasswordchange);
routes.post("/studentverifymail",studentctrl.studentverifymail);
routes.post("/studentupdateforgatepassword",studentctrl.studentupdateforgatepassword);
routes.get("/unauthstudent",async(req,res)=>{
    return res.status(400).json({msg:"studnet are not authorise "});
})

module.exports=routes;
