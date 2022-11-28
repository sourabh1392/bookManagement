const jwt = require("jsonwebtoken")

let authentication = (req, res, next)=>{
    let token = req.headers["x-api-key"]

    jwt.verify(token, "book management", (err, decode)=>{
        console.log(err, decode)
        if(err){return res.status(401).send({status:false, message:"Authenitication failed"})}
        if(decode){
            req.decode = decode
            next()
        }
    })
}

let autherisation = (req, res, next)=>{
      
}

module.exports = {authentication, autherisation}