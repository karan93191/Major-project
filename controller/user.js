const User = require("../models/user");
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs")
}
module.exports.signup=async(req,res,next)=>{
    try{
        let {email,username,password}=req.body
const newUser=new User({email,username})
const registereduser= await User.register(newUser,password)
console.log(registereduser)
req.login(registereduser,(err)=>{
    if(err){
       return  next(err)
    }
req.flash("success","user has registered")
res.redirect("/listings")
})
    }catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
    
}
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs")
}
module.exports.login=async (req,res) => {
req.flash("success","welcome back to page")
let redirecturl=res.locals.redirecturl || "/listings"
    res.redirect(redirecturl)    
}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err)
        }
        req.flash("success","you are logged out")
        res.redirect("/listings")
    })
}