const express=require("express");

const port=9000;

const app=express();
const db=require("./config/mongoose");

// const mongoose=require("mongoose");

const passport=require('passport')
const session=require("express-session");
const jwtpassport=require("./config/passport_jwt_stagty")

app.use(express.urlencoded());

// mongoose.connect('mongodb+srv://sumitsvg9836:OCYibTjsM16AabZl@cluster0.8lhg9.mongodb.net/schoolpanel').then((res) =>{
//     console.log('db is connected')
// })
// .catch((err) =>{
//     console.log(err);
// })



app.use(
    session({
        name:'jwtSession',
        secret: 'rnw', // Replace with a secure secret key
        resave: false,             // Prevent resaving unchanged sessions
        saveUninitialized:false,  
         // Save uninitialized sessions
        cookie: {
             maxAge:1000*60*60
            }, // Use `secure: true` in production with HTTPS
    })
);

app.use(passport.initialize());
app.use(passport.session());


app.use("/api",require("./routes/Api/V1/Adminroutes/adminauth"));

app.listen(port,(err)=>{
    if(err){
        console.log("err");
        return false;
    }
    console.log("server is runnig on port",port)
})