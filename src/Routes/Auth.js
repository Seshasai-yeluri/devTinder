const express = require("express");
const bcrypt = require("bcrypt");
const {UserModel}= require("../models/user");
const { Auth } = require("../Authentication/Auth");
const authRouter = express.Router();


//sign up
authRouter.post("/signup",async(req,res)=>{
    const password = await bcrypt.hash(req.body.password,10)
    const user = new UserModel({
        ...req.body,
    password:password
})
    await user.save()
    res.send("Signed up successfully")
    
});


//login
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


//logout
authRouter.post("/logout",(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now())
    })
    res.send("Logged out Successfully!!!")
})


//update password
authRouter.patch("/updatePassword",Auth,async(req,res)=>{
    try{
        const userId = req.loggedInUserId;
        const {email,oldPassword,newPassword} = req.body;
        const user = await UserModel.findById(userId);
        const isEmailMatched = user.email === email
        if(!isEmailMatched){
            throw new Error("Enter a valid Email")
        }
        const isPasswordValid = await user.passwordValidation(oldPassword)
        if(!isPasswordValid){
            throw new Error("Invalid Password!!!")
        }
        const hashedPassowrd =  await bcrypt.hash(newPassword,10)
        console.log("hashedPassword",hashedPassowrd)
        const updatePassword = await UserModel.findByIdAndUpdate(
            userId
        ,
        {$set : {
            password:hashedPassowrd
        }},{
            new : true
        }
    )
    res.status(200).json({
        message:"password updated successfully",
        data : updatePassword
    })
    }
catch(err){
    res.status(400).send(" " + err.message)
}})

module.exports = {
    authRouter
}

