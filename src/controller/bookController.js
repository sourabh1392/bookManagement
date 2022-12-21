const { isValidObjectId } = require("mongoose");
const bookModel = require("../model/bookModel")
const reviewModel = require("../model/reviewModel")
const moment = require("moment")
const { checkISBN, checkDate, validTitleBooks } = require("../validator/validation")






//******************************************************* API to create Book ************************************************//

const createBook = async (req, res) => {
    try {
        let data = req.body;
        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Please provide book details to create user" }) }

        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data

        if (!userId) { return res.status(400).send({ status: false, message: 'userId is Required' }) }
        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, message: "Please enter valid userId" }) }

        //autherisation.......
        if (req.decodedToken.userId != userId) { return res.status(403).send({ status: false, msg: "Not Authorized !" }) }

        //title validation.......
        if (!title) { return res.status(400).send({ status: false, message: 'Title is required' })}
        if (!validTitleBooks(title)) { return res.status(400).send({ status: false, message: 'Please enter a valid Title' }) }

        const bookData = await bookModel.findOne({ title: title })
        if (bookData) { return res.status(400).send({ status: false, message: "Title is already presents, please enter another title" }) }

        if (!excerpt) { return res.status(400).send({ status: false, message: 'Excerpt is required' })}

        //ISBN number validation......
        if (!ISBN) { return res.status(400).send({ status: false, message: 'ISBN is Required' }) }
        if (!checkISBN(ISBN)) { return res.status(400).send({ status: false, message: "Please enter a valid ISBN" }) }
        const bookDataISBN = await bookModel.findOne({ ISBN: ISBN })
        if (bookDataISBN) { return res.status(400).send({ status: false, message: "ISBN is already presents, please enter another ISBN" }) }

        if (!category) { return res.status(400).send({ status: false, message: 'category is Required' }) }
        if (!subcategory) { return res.status(400).send({ status: false, message: 'subcategory is Required' }) }

        //date format validation......
        if (!releasedAt) { return res.status(400).send({ status: false, message: 'releasedAt is Required' }) }
        if (!checkDate(releasedAt)) { return res.status(400).send({ status: false, message: "Please enter a valid date" }) }

        if(data.isDeleted){
            data.deletedAt = moment().format('YYYY-MM-DD')
        }
        
        const result = await bookModel.create(data)
        return res.status(201).send({ status: true, message: 'Success', data: result })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    };
}




//***************************************************** API to create fetch books ************************************************//

const getBook = async (req, res) => {
    try {
        let data = req.query
        data.isDeleted = false

        if (data.userId) {
            if (!isValidObjectId(data.userId)) { return res.status(400).send({ status: false, message: "Please enter valid userId" }) }
        }
        
        let result = await bookModel.find(data).select({ ISBN: 0, subcategory: 0, deletedAt: 0, isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 }).sort({ title: 1 })
        if (result.length == 0) { return res.status(404).send({ status: false, message: "No such Books found" }) }

        return res.status(200).send({ status: true, message: "Success", data: result })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}




//**************************************************** API to fetch book by Id ************************************************//

const getBookById = async (req, res) => {
    try {
        let bookId = req.params.bookId;
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Enter valid BookId" })

        let bookData = await bookModel.findById(bookId).select({ __v: 0 }).lean()
        if (!bookData) { return res.status(404).send({ status: false, message: "No such book found" }) }
        if (bookData.isDeleted == true) { return res.status(404).send({ status: false, message: "Book is Deleted" }) }

        let reviewsData = await reviewModel.find({ bookId: bookId, isDeleted: false })
        bookData.reviewsData = reviewsData

        res.status(200).send({ status: true, message: 'Success', data: bookData })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}




//******************************************************* API to update Book ************************************************//

const updateBook = async (req, res) => {
    try {
        let bookId = req.params.bookId;

        if (req.bookData.isDeleted == true) { return res.status(400).send({ status: false, message: "This book is deleted" }) }

        let data = req.body;
        let arr = Object.keys(data)
        if (arr.length == 0) { return res.status(400).send({ status: false, message: "Please enter data to update" }) }

        let { title, excerpt, releasedAt, ISBN } = data;

        for(let i=0; i<arr.length; i++){
            let msg = ["title", "excerpt", "releasedAt", "ISBN"].includes(arr[i])
            if(msg == false){return res.status(400).send({status:false, message:"It update only title, excerpt, releasedAt and ISBN"})}
        }

        if (title || title=="") {
            if (!validTitleBooks(title)) { return res.status(400).send({ status: false, message: 'Please enter a valid Title' }) }
            const bookData = await bookModel.findOne({ title: title })
            if (bookData) { return res.status(400).send({ status: false, message: "Title is already presents, please enter another title" }) }
        }
        if(excerpt || excerpt==""){
            if(!excerpt){return res.status(400).send({status:false, message:"excerpt can't be empty"})}
        }

        if (releasedAt || releasedAt=="") {
            if (!checkDate(releasedAt)) { return res.status(400).send({ status: false, message: "Please enter a valid date" }) }
        }
        if (ISBN || ISBN=="") {
            if (!checkISBN(ISBN)) { return res.status(400).send({ status: false, message: "Please enter a valid ISBN number" }) }
        }

        const bookDataISBN = await bookModel.findOne({ ISBN: ISBN })
        if (bookDataISBN) { return res.status(400).send({ status: false, message: "ISBN is already presents, please enter another ISBN" }) }

        let result = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: data }, { new: true })
        res.status(200).send({ status: true, message: 'Success', data: result })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
    
}




//******************************************************* API to delete Book ************************************************//

const deleteBook = async function (req, res) {
    try {
        const booksId = req.params.bookId

        if(req.bookData.isDeleted == true)return res.status(400).send({ status: false, message: "Book already Deleted" })
       
        await bookModel.findOneAndUpdate({ _id: booksId }, { isDeleted: true, deletedAt: moment().format('YYYY-MM-DD') })
        return res.status(200).send({ status: true, message: "Book deleted successfully" })

    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}



module.exports = { createBook, getBook, getBookById, updateBook, deleteBook }