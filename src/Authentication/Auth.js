const jwt = require("jsonwebtoken");
const Auth = (req,res,next)=>{
    try{
    const cookies = req.cookies;
    const {token} = cookies;

    if(!token){
        throw new Error("Please Login!!!")
    }

    const isLoggedInUser = jwt.verify(token,"seshasai@123");
    if(!isLoggedInUser){
        res.status(400).send("Not a valid token")
    }

    const {_id} = isLoggedInUser;

    req.loggedInUserId = _id;
    next();
}
catch(err){
    res.status(400).send("Error "+ err.message)
}
}

module.exports = {
    Auth
}