const express = require("express");
const {mongooseDB} = require("./config/database")
const cookieParser = require("cookie-parser");
const { authRouter } = require("./Routes/Auth");
const { profileRouter } = require("./Routes/ProfileInfo");
const {ConnectionRequestRouter} = require("./Routes/ConnectionRequest");
const { reviewRouter } = require("./Routes/Review");
const App = express();

App.use(express.json())
App.use(cookieParser())
App.use(authRouter)
App.use(profileRouter)
App.use(ConnectionRequestRouter)
App.use(reviewRouter)
mongooseDB()
.then(()=>{
    console.log("Database connection established...")
    App.listen(7779,()=>{
    console.log("Server is listening to port 7779")
});
})
.catch(()=>{
    console.log("Database not connected!!!")
})
