const express=require("express")
const app=express()
const mongoose=require("mongoose")
const Listing=require("../models/listing.js")
const initData=require("../init/data.js")


main().then(()=>{
    console.log("connection success")
    })
    .catch(err => console.log(err));
    
    async function main() {
      await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    }
    
   const initDB= async () => {
        await Listing.deleteMany({})
        initData.data=initData.data.map((obj)=>({...obj,owner:'68c058cd2541eca3b36a3aab'}))
        await Listing.insertMany(initData.data)
        console.log("data sacved")
    }
    initDB();