const mongoose = require("mongoose");

const mongooseDB = async()=>{
    await mongoose.connect("mongodb+srv://seshasaiyeluri_db_user:MTPEdCNj5wEFHxTy@namastenode.tg99n5l.mongodb.net/devTinder")
}

module.exports = {
    mongooseDB
}