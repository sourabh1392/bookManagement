const jwt = require("jsonwebtoken")
const { isValidObjectId } = require("mongoose");
const bookModel = require("../model/bookModel")


const authentication = (req, res, next) => {
    try {
        const token = req.headers['x-api-key']
        if (token) {
            jwt.verify(token, "book management", (error, decode) => {
                if (error) {
                    if (error.message == 'jwt expired') {
                        return res.status(400).send({ status: false, message: 'Your Token has been expired login Again' })
                    } else return res.status(401).send({ status: false, message: "Authenitication failed" })
                }
                req.decodedToken = decode
                next()
            })
        }
        else return res.status(404).send({ status: false, msg: "Token is missing" })
       
    }
    catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}



const autherisation = async (req, res, next) => {
    try {
        const bookId = req.params.bookId;
        if (!isValidObjectId(bookId)){ return res.status(400).send({ status: false, msg: "Enter Valid book Id" }) }

        const bookData = await bookModel.findById(bookId)
        if (!bookData) {return res.status(404).send({ status: false, msg: "Book not found" })}
        req.bookData = bookData

        if (bookData.userId != req.decodedToken.userId) { return res.status(401).send({ status: false, msg: "Not Authorized !" }) }
        next()

    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}




module.exports = { authentication, autherisation }