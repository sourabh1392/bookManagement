const reviewModel = require("../model/reviewModel")
const bookModel = require("../model/bookModel")
const moment = require("moment");
const { isValidObjectId } = require("mongoose");


const createReview = async (req, res) => {
    try {
        let data = req.body;
        if(Object.keys(data).length ==0){return res.status(400).send({status:false, message:"Please enter review details"})}

        let bookId = req.params.bookId;
        if(!isValidObjectId(bookId)){return res.status(400).send({status:false, message:"Please enter a valid Book Id"})}

        let bookData = await bookModel.findById(bookId)
        data.reviewedAt = moment().format("YYYY-MM-DD")

        data.bookId = bookId
        
        
        await reviewModel.create(data)
        let reviewsData = await reviewModel.find({ bookId: bookId }).select({isDeleted:0, __v:0})

        let review = bookData.reviews + 1
        let updateBook = await bookModel.findByIdAndUpdate(bookId, { $set: { reviews: review } }, { new: true }).lean()

        updateBook.reviewsData = reviewsData

        res.status(200).send({ status: true, message: 'Success', data: updateBook })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}



const updateReview = async (req, res) => {

    try {
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;
        let data = req.body

        let bookData = await bookModel.findById(bookId).lean()
        if (bookData.reviews == 0) { return }

        await reviewModel.findByIdAndUpdate(reviewId, { $set: data })
        let reviewsData = await reviewModel.find({ bookId: bookId, isDeleted: false })

        bookData.reviewsData = reviewsData

        res.status(200).send({ status: true, message: 'Success', data: bookData })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


const deleteReview = async (req, res) => {

    try {
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;

        let bookData = await bookModel.findById(bookId)
        if (bookData.reviews == 0) { return }

        let review = bookData.reviews-1

        await reviewModel.findByIdAndUpdate(reviewId, { $set: { isDeleted: true } })
        let updateReview = await bookModel.findByIdAndUpdate(bookId, {$set:{reviews:review}}, {new:true}).lean()

        let reviewsData = await reviewModel.find({ bookId: bookId, isDeleted: false })

        updateReview.reviewsData = reviewsData

        res.status(200).send({ status: true, message: 'Success', data: updateReview })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}

module.exports = { createReview, updateReview, deleteReview }