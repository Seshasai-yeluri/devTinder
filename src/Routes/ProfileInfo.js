const express = require("express");
const jwt = require("jsonwebtoken")
const profileRouter = express.Router();
const {UserModel} = require("../models/user")


profileRouter.get("/userDetails", async(req,res)=>{
    try{
        console.log("req.body",req.body)
        const cookies = req.cookies;
        const {token} = cookies
         if (!token) {
      return res.status(401).send("Please login first");
    }
    const isTokenValid = jwt.verify(token,"seshasai@123")
    if(!isTokenValid){
        throw new Error("Not a valid token")
    }

    const {_id} = isTokenValid;
    

    const user = await  UserModel.findById({_id:_id})
    res.send(user);
}
catch(err){
    res.send("Error" + err.message)
}
})


profileRouter.patch("/editInfo",async(req,res)=>{
    try{
    const cookies = req.cookies;
    const {token} = cookies;

    if(!token){
        throw new Error("Please login first")
    }

    const isValidToken = jwt.verify(token,"seshasai@123");

    if(!isValidToken){
        throw new Error("Not a valid token");
    }

    const {_id} = isValidToken
    const updatedDetails = await UserModel.findByIdAndUpdate({_id:_id},{ $set: req.body },{new:true});

    res.json({
        message : "Details updated successfully",
        details : updatedDetails
    })
}
catch(err){
    res.status(400).send("Something went wrong")
}
})

module.exports = {
    profileRouter
}