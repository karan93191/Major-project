const express=require("express")
const router=express.Router()
const User=require("../models/user")
const wrapAsync = require("../utils/wrapAsync")
const passport=require("passport")
const { saveredirecturl } = require("../middleware")
const userController=require("../controller/user")

// rendersignupform and signup route
router.route("/signup")
.get((userController.renderSignupForm))
.post(wrapAsync(userController.signup))

// renderloginform and login user
router.route("/login")
.get((userController.renderLoginForm))
.post(saveredirecturl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
(userController.login))

// logout user
router.get("/logout",(userController.logout))
module.exports=router;