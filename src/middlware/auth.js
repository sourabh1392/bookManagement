const jwt = require("jsonwebtoken")
const { isValidObjectId } = require("mongoose");



const authentication = (req, res, next)=>{
    try{ 
        const token=req.headers['x-api-key']
        if(token){
            jwt.verify(token,"book management" , (error , decode)=>{
                if(error) {
                    if(error.message =='jwt expired'){
                        return res.status(400).send({status:false, message : 'Your Token has been expired login Again' })
                    }else return res.status(401).send({status:false, message:"Authenitication failed"})
                }     
            req.decodedToken=decode  
            })}
        else res.status(404).send({status:false,msg:"Token is missing"})
        next()
    }
    catch(err){
        return res.status(500).send({status:false, Error:err.message})
    }
}



const autherisation =  async (req, res, next)=>{
    try {
    const bookId = req.params.bookId;
    if(Object.keys(req.params).length != 1){return res.status(400).send({status:false,message:"Please enter BookId"})}
        
    if (!isValidObjectId(bookId)){return res.status(400).send({status :false , msg: "Enter Valid book Id" })}

    const bookData = await bookModel.findById(bookId)
    if(!bookData)  return res.status(404).send({status :false , msg: "Book not found" })
    req.bookData = bookData

    if(bookData !== req.decodedToken.bookData) {return res.status(401).send({ status: false, msg: "Not Authorized !" })}
    next()

    } catch (err) {
        return res.status(500).send({status:false, Error:err.message})
    }
}




    module.exports = {authentication, autherisation}