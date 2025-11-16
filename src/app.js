const express = require("express");

const App = express();


//queryParams
App.get("/user",(req,res)=>{
    console.log(req.query)
    if(req.query.userId==='101')
    res.send(`Hello user , your query Id is ${req.query.userId}`)
})

//dynamic routing
App.get('/user/:userId',(req,res)=>{
    console.log(req.params)
    if(req.params.userId==='101')
    res.send(`Hello user , your param Id is ${req.params.userId}`)
})

App.use('/hello',(req,res)=>{
    res.send("Hello arrow function")
})

App.use('/',(req,res)=>{
    res.send("Hello arrow function")
})
App.listen(7779,()=>{
    console.log("Server is listening to port 7779")
});