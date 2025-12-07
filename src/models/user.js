const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName : {
        type: String
    },
    lastName : {
        type: String
    },
    email : {
        type: String
    },
    password : {
        type: String
    },
    age : {
        type: Number
    },
    gender : {
        type: String
    },
})

userSchema.methods.getJWT = function(){
    // this refers to the document fetched from DB for a particular user
    const user = this;
    const token = jwt.sign({_id:user._id},"seshasai@123")

    return token;
}

userSchema.methods.passwordValidation = async function(passwordByUserInput){
    // this refers to the document fetched from DB for a particular user
    const user = this;
    const isPasswordValid = await bcrypt.compare(passwordByUserInput,user.password)
    console.log("isPassowrd",isPasswordValid)
    return isPasswordValid;
}

const UserModel = mongoose.model("user",userSchema)

module.exports = {
    UserModel
}