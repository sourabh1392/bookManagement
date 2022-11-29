const { isValidObjectId } = require("mongoose");
const bookModel = require("../model/bookModel")
const reviewModel = require("../model/reviewModel")



//--------------- Validation function for ISBN number----------------// 
function checkISBN(str) {
    var re = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
    return re.test(str);
}

//--------------- Validation function for Date format----------------// 
function checkDate(str) {
    var re = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
    return re.test(str);
}


//-------------API to create Book-----------------//

const createBook = async (req, res) => {
    try {
        let data = req.body;
        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Please provide book details to create user" }) }

        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data

        if (!title) { return res.status(400).send({ status: false, message: 'Title is required' }) }
        if (!excerpt) { return res.status(400).send({ status: false, message: 'Excerpt is required' }) }
        if (!userId) { return res.status(400).send({ status: false, message: 'userId is Required' }) }
        if (!ISBN) { return res.status(400).send({ status: false, message: 'ISBN is Required' }) }
        if (!category) { return res.status(400).send({ status: false, message: 'category is Required' }) }
        if (!subcategory) { return res.status(400).send({ status: false, message: 'subcategory is Required' }) }
        if (!releasedAt) { return res.status(400).send({ status: false, message: 'releasedAt is Required' }) }

        const bookData = await bookModel.findOne({ title: title })
        if (bookData) { return res.status(400).send({ status: false, message: "Title is already presents, please enter another title" }) }

        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, message: "Please enter valid userId" }) }
        
        if (!checkISBN(ISBN)) { return res.status(400).send({ status: false, message: "Please enter a valid date" }) }
        
        const bookDataISBN = await bookModel.findOne({ ISBN: ISBN })
        if (bookDataISBN) { return res.status(400).send({ status: false, message: "ISBN is already presents, please enter another ISBN" }) }

        if (!checkDate(releasedAt)) { return res.status(400).send({ status: false, message: "Please enter a valid date" }) }

        const result = await bookModel.create(data)
        return res.status(201).send({ status: true, message: 'Success', data: result })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    };
}


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




const getBookById = async (req, res) => {
    try {
        let bookId = req.params.bookId;
        let bookData = await bookModel.findById({ _id: bookId }).lean()
        //isDle true error
        let reviewsData = await reviewModel.find({ bookId: bookId, isDeleted: false })
        bookData.reviewsData = reviewsData
        res.status(200).send({ status: true, message: 'Success', data: bookData })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


const updateBook = async (req, res) => {
    try {
        let bookId = req.params.bookId;
        let data = req.body;
        let result = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: data }, { new: true })
        res.status(200).send({ status: true, message: 'Success', data: result })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const deleteBook = async (req, res) => {
    try {
        let bookId = req.params.bookId;
        let bookData = await bookModel.findById(bookId)
        //already check delted or not
        await bookModel.findByIdAndUpdate(bookId, { $set: { isDeleted: true, deletedAt: Date.now() } })
        res.status(200).send({ status: true, message: "Deleted" })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}



module.exports = { createBook, getBook, getBookById, updateBook, deleteBook }