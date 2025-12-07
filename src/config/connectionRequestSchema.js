const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
    fromId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    toId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    status : {
        type : String,
        enum : {
            values : ["interested","ignored","accepted","rejected"],
            message : "{VALUE} is not supported"
        }
    }
},{
    timestamps:true
})

connectionSchema.pre("save",function (){
    // this refers to the document created just before saving !!!
    const isEqual = this.fromId.equals(this.toId);
    if(isEqual){
        throw new Error("Cannot send request to yourself!!!")
    }
})

connectionSchema.index({fromId:1,toId:1})

const RequestModel = mongoose.model("connection",connectionSchema);

module.exports = {
    RequestModel
}