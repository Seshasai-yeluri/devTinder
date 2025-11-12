const express = require("express");

const App = express();

// App.use((req,res)=>{
//     res.send("Hello from express server!!!")
// })

App.use('/hello',(req,res)=>{
    res.send("Hello arrow function")
})

App.listen(7779,()=>{
    console.log("Server is listening to port 7779")
});