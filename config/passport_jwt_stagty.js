const passport=require("passport");

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts={
    jwtFromRequest :ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:"rnw"
}

const SchoolAdmin=require("../models/Adminmodels");
const Faculty=require("../models/Facultyrmodel");
const student=require("../models/Studentmodels");

passport.use(new JwtStrategy(opts, async function(payload, done) {
    let checkAuthuser=await SchoolAdmin.findOne({email:payload.userdata.email})
    if(checkAuthuser) {
        return done(null, checkAuthuser);
    }
    else{
        return done(null,false)
    }
    
}));

const options={
    jwtFromRequest :ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:"svg"
}
passport.use('faculty',new JwtStrategy(options, async function(payload, done) {
    let Authusercheck=await Faculty.findOne({email:payload.Facultydata.email})
    if(Authusercheck) {
        return done(null, Authusercheck);
    }
    else{
        return done(null,false)
    }
    
}));

const myoption={
    jwtFromRequest :ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:"sumit"
}
passport.use('student',new JwtStrategy(myoption, async function(payload, done) {
    let Authusercheck=await student.findOne({email:payload.StudentRecord.email})
    if(Authusercheck) {
        return done(null, Authusercheck);
    }
    else{
        return done(null,false)
    }
    
}));

passport.serializeUser((user,done)=>{
    return done(null, user.id);
})

passport.deserializeUser(async  (id, done) =>{
    let userdata= await SchoolAdmin.findById(id);
    if(userdata){
      return done(null,userdata);
    }
    else{
          return done(null,false);
    }
});


module.exports=passport;
   
