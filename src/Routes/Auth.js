const express = require("express");
const bcrypt = require("bcrypt");
const {UserModel}= require("../models/user")
const authRouter = express.Router();

authRouter.post("/signup",async(req,res)=>{
    const password = await bcrypt.hash(req.body.password,10)
    const user = new UserModel({
        ...req.body,
    password:password
})
    await user.save()
    res.send("Signed up successfully")
    
});

authRouter.post("/login",async(req,res)=>{
    try{
    const {email,password} = req.body;

    const user = await UserModel.findOne({email:email})
    console.log("email",email,"password",password)
    const isPasswordValid = await user.passwordValidation(password)

    if(isPasswordValid){
        const token = user.getJWT();
        if(!token){
            throw new Error("Invalid Token")
        }
        res.cookie("token",token)
        res.send("Token generated successfully")
    }
    else{
        throw new Error("Not a valid password")
    }
}
    catch(err){
        res.status(401).send("Error" + err.message)
    }
})

authRouter.post("/logout",(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now())
    })
    res.send("Logged out Successfully!!!")
})

module.exports = {
    authRouter
}

