const passport=require("passport");

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts={
    jwtFromRequest :ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:"rnw"
}

const SchoolAdmin=require("../models/Adminmodels")

passport.use(new JwtStrategy(opts, async function(payload, done) {
    let checkAuthuser=await SchoolAdmin.findOne({email:payload.userdata.email})
    if(checkAuthuser) {
        return done(null, checkAuthuser);
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
   
