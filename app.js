if(process.env.NODE_ENV !="production"){
  require('dotenv').config()
}
// console.log(process.env) 
const express=require("express")

const app=express()
const mongoose=require("mongoose")
const Listing=require("../majorproject/models/listing")
const path=require("path")
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate")
const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./models/user.js")
app.engine("ejs",ejsMate)
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"/public")))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
// app.use(express.json());
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("./schema.js")
const Review=require("../majorproject/models/review")
const listings=require("./routes/listing.js")
const reviews=require("./routes/review.js")
const user=require("./routes/user.js")
const session=require("express-session")
const MongoStore = require('connect-mongo');
const flash=require("connect-flash")
const dbUrl=process.env.ATLAS_URL
main().then(()=>{
    console.log("connection success")
    })
    .catch(err => console.log(err));
    
    async function main() {
      await mongoose.connect(dbUrl);
    }
    
//    const validateListing=(req,res,next)=>{
//      let {err}=  listingSchema.validate(req.body);
//        if(err){
//   throw new ExpressError(400, err);
// }else{
//   next();
// }
//    }
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter:24*3600,
});
const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie: {
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true, 
  },
}

// app.get("/",(req,res)=>{
//       res.send("hi i am root")
//     })
app.use(session(sessionOptions))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
  res.locals.success=req.flash("success")
  res.locals.error=req.flash("error")
  res.locals.currUser=req.user
  next();
})
// app.get("/demouser",async(req,res)=>{
//   let fakeUser=new User({
//     email:"student@gmail.com",
//     username:"delta-batch"
//   })
//    let regiterdeuser=await User.register(fakeUser,"helloWorld")
//    res.send(regiterdeuser)
// })
app.use("/",user)
app.use("/",listings)
app.use("/",reviews)
    

  app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
    
    app.use((err,req,res,next)=>{
      let {status=500,message="something wrong"}=err
      res.status(status).render("listings/error.ejs",{message})
      // res.status(status).send(message)
    })
   
    
     app.listen(8080,(()=>{
      console.log("app is listening on 8080")
    }))


    // app.get("/testlisting",(req,res)=>{
    //   let sampleListing=new Listing({
    //     title:"my new villa",
    //     description:"by the beach",
    //     price:1200,
    //     location:"calangute,goa",
    //     country:"India"
    //   })
    //   sampleListing.save()
    //   console.log("sample was saved")
    //   res.send("succesuful")
    // })