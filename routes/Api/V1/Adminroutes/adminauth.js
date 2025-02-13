const express=require("express")

const routes=express.Router();


const passport=require("passport");

const SchoolAdmin=require("../../../../models/Adminmodels")

const Adminctrl=require("../../../../controllers/Api/V1/Admincontrollers")

routes.post("/adminregiter",Adminctrl.SchoolAddAdmin);
routes.post("/adminlogin",Adminctrl.SchoolAdminLogin);


routes.get("/unauth",async(req,res)=>{
    return res.status(400).json({msg:"user are not login "});
})

routes.get("/adminprofile",passport.authenticate('jwt',{failureRedirect:"/api/unauth"}),Adminctrl.adminprofile)
routes.put("/admineditprofile/:id",passport.authenticate('jwt',{failureRedirect:"/api/unauth"}),Adminctrl.admineditprofile)
routes.get("/adminlogout",passport.authenticate('jwt',{failureRedirect:"/api/unauth"}),Adminctrl.adminlogout)
routes.post("/changepassword",passport.authenticate('jwt',{failureRedirect:"/api/unauth"}),Adminctrl.changepassword)

module.exports=routes;