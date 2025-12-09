const express = require("express");
const {UserModel} = require("../models/user")
const jwt = require("jsonwebtoken")
const {RequestModel} = require("../config/connectionRequestSchema")
const {Auth} = require("../Authentication/Auth")
const ConnectionRequestRouter = express.Router();



ConnectionRequestRouter.post("/request/send/:status/:id",Auth,async (req,res)=>{
    try{
    const _id = req.loggedInUserId;
    const toId = req.params.id;
    const status = req.params.status;

    const validStatus = ["interested","ignored"];

    const isValidStatus = validStatus.includes(status);
    if(!isValidStatus){
        throw new Error("Not a valid status");
    }

    const data = await RequestModel.findOne({
        $or: [
    { fromId: _id,toId },
    { fromId: toId,toId : _id }
  ]
    },{})
    if(data){
        throw new Error("Connection request was already sent earlier")
    }
    const user1 = await UserModel.findById({_id:_id});
    const user2 = await UserModel.findById({_id:toId})
    const connectionRequest = new RequestModel({
        fromId : _id,
        toId,
        status
    })

    await connectionRequest.save();
    res.status(200).json({
        message : `connection Request from ${user1.firstName} to ${user2.firstName} sent successfully `
    })
}
catch(err){
    res.status(400).send("Error " + err.message)
}

})

ConnectionRequestRouter.post("/request/review/:status/:id",Auth,async (req,res)=>{
    try{
    const toId = req.loggedInUserId;
    const status = req.params.status;
    const _id = req.params.id;

    const validStatus = ["accepted","ignored"];
    if(!validStatus.includes(status)){
        throw new Error("Not a valid status");
    }

    console.log("_id",_id,"toId",toId)
    const data = await RequestModel.findOne({
        fromId:_id,
        toId:toId,
        status:"interested"
    })

    if(!data){
        throw new Error("No request found for accepting");
    }

    const updatedData = await RequestModel.findOneAndUpdate({
        fromId:_id,
    },{
        $set: {status:"accepted" }
})
res.status(200).json({
    message : "Status updated successfully",
    data : updatedData
})
    }
    catch(err){
        res.status(400).send("Error"+ err.message)
    }
})




module.exports = {
    ConnectionRequestRouter
}