const express=require("express");
const wrapAsync = require("../utiles/wrapAsync");
const router =express.Router();
const User=require("../models/user.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController=require("../controllers/users");

router.route("/signup")
.get(userController.renderSignForm)
.post(wrapAsync(userController.signUp));


router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
wrapAsync(userController.login));


// GET Route -Logout 
router.get("/logout",userController.logOut);

module.exports=router;