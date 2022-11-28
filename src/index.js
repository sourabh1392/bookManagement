const express = require("express")
const mongoose = require("mongoose")
const route = require("./route/route")
const app = express()

app.use(express.json())

app.use("/", route)

mongoose.connect("mongodb+srv://amanprajapat82780:Lucky82780@newproject.3qdy8y3.mongodb.net/group17Database?retryWrites=true&w=majority",{
    useNewUrlParser:true
}).then(()=>console.log("Mongoose Connected"))
.catch((err)=>console.log(err))

app.listen(3000, ()=>{
    console.log("Server runnig on ", 3000)
})