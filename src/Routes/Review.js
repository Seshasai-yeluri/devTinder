const express = require("express");
const { Auth } = require("../Authentication/Auth");
const { RequestModel } = require("../config/connectionRequestSchema");
const { UserModel } = require("../models/user");
const reviewRouter = express.Router();

reviewRouter.get("/review/receivedRequests",Auth,async (req,res)=>{
    try{
    const _id = req.loggedInUserId;

    const data = await RequestModel.find({
        toId:_id,
        status:"interested"
    }).populate("fromId","firstName lastName age gender")
    if(!data){
        throw new Error("no connection requests");
    }
    res.status(400).json({
        message : "All connections received",
        data : data
    })
}catch(err){
    res.status(400).send("Error "+ err.message)
}
})

reviewRouter.get("/connections",Auth,async (req,res)=>{
    try{

    const toId = req.loggedInUserId

    const connectionRequest = await RequestModel.find({
        $or : [
            {fromId:toId,status:"accepted"},
            {toId:toId,status:"accepted"}
        ]
    }).populate("fromId","firstName lastName age gender").populate("toId","firstName lastName age gender")

    const data = connectionRequest.map(item => ({
    fromId: item.fromId,
    toId: item.toId
}));

    res.status(200).send(data)
}catch(err){
    res.status(400).send("Error "+ err.message)
}
})

reviewRouter.get("/feed",Auth, async(req,res)=>{
    try{
    const toId = req.loggedInUserId;
    console.log("toId",toId)

    const connectionData1 = await RequestModel.find({
        toId:toId
    });
    const FromIdData = connectionData1.map((item)=>item.fromId)

    const connectionData2 = await RequestModel.find({
        fromId:toId
    })

    const toIdData = connectionData2.map((item)=>item.toId)

    const combinedData = [...FromIdData,...toIdData]
 
    console.log("combinedData",combinedData)
    const allUserData = await UserModel.find(UserModel.find({
  _id: { $ne: toId }
}));

const connectionDataFromIdList = combinedData.map((item)=>item.toString());
    const filteredData = allUserData.filter((user)=>!connectionDataFromIdList.includes(user._id.toString()));
    res.status(200).send(filteredData);
}
catch(err){
    res.status(400).send("Error " + err.message)
}
})





module.exports = {
    reviewRouter
}