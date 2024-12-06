if(process.env.NODE_ENV!="production"){
require('dotenv').config();
}

// console.log(process.env.CLOUD_NAME);

const express=require("express");
const app=express();
const mongoose=require("mongoose");
 
const dbURL=process.env.ATLASDB_URL;

const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));
const ExpressError=require('./utiles/expressError.js');
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');

const store=MongoStore.create({
    mongoUrl:dbURL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE ",err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


// Session midddleware 
app.use(session(sessionOptions));

// Flash middleware
app.use(flash());

// Passport Middleware 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main()
.then(()=>{console.log("Connection established.")})
.catch((err)=>{console.log(err);})

async function main(){
    await mongoose.connect(dbURL);
}

app.listen(8080,()=>{console.log("Listening on port 8080")});
// app.get("/",(req,res)=>{
//     res.send("Working fine....");
// })

app.use((req,res,next)=>{
   res.locals.success=req.flash("success");
   res.locals.error=req.flash("error");
   res.locals.currUser=req.user;
   res.locals.country = req.query.country || '';
   res.locals.destination = req.query.destination || '';
   next();
});


// app.use("/demouser",async (req,res)=>{
//     let fakeUser=new User({
//         email:"student1@gmail.com",
//         username:"Aman",
//     });
//     let registeredUser= await User.register(fakeUser,"testing");
//     res.send(registeredUser);
// });



// Listings Router 
app.use("/listings",listingRouter);


// Review Router
app.use("/listings/:id/reviews",reviewRouter);

// User Router
app.use("/",userRouter);


// For all other routes 
app.all("*",(req,res,next)=>{
   next(new ExpressError(404,"Page not found"));
});



// Custom error handling middleware 
app.use((err,req,res,next)=>{
    let {status=500,message="Some Error in DB"}=err;
    res.status(status).render("listings/error.ejs",{status,message});
});

























