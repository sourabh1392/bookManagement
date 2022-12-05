const reviewModel = require("../model/reviewModel")
const bookModel = require("../model/bookModel")
const moment = require("moment");
const { isValidObjectId } = require("mongoose");
const { checkName } = require("../validator/validation")





//******************************************************* API to create Review ************************************************//

const createReview = async (req, res) => {
    try {
        let data = req.body;
        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Please enter review details" }) }

        let bookId = req.params.bookId;
        if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: "Please enter a valid Book Id" }) }
        let bookData = await bookModel.findOne({_id:bookId, isDeleted:false})
        if (!bookData) { return res.status(404).send({ status: false, message: "No such book found" }) }

        let { reviewedBy, rating } = data;

        if (reviewedBy) {
            if (!checkName(reviewedBy)) { return res.status(400).send({ status: false, message: "Please enter a valid reviewedBy name" }) }
            data.reviewedBy = checkName(reviewedBy)
        } else {
            data.reviewedBy = "Guest"
        }

        if (rating < 1 || rating > 5 || typeof (rating) != "number") {
            { return res.status(400).send({ status: false, message: "Please enter rating between 1 to 5" }) }
        } else {
            if (!rating) { return res.status(400).send({ status: false, message: "Please enter rating" }) }
        }

        data.bookId = bookId
        data.reviewedAt = moment().format("YYYY-MM-DD")

        let reviewsData = await reviewModel.create(data)

        let updateBook = await bookModel.findByIdAndUpdate(bookId, { $inc: { reviews: 1 } }, { new: true }).lean()

        updateBook.reviewsData = [reviewsData]
        res.status(201).send({ status: true, message: 'Success', data: updateBook })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}





//******************************************************* API to update Review ************************************************//

const updateReview = async (req, res) => {

    try {
        let bookId = req.params.bookId;
        if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: "Please enter a valid Book Id" }) }
        let bookData = await bookModel.findOne({_id:bookId, isDeleted:false}).lean()
        if (!bookData) { return res.status(404).send({ status: false, message: "No such book found" }) }
      
        let reviewId = req.params.reviewId;
        if (!isValidObjectId(reviewId)) { return res.status(400).send({ status: false, message: "Please enter a valid review Id" }) }
        let reviewData = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted:false })
        if (!reviewData) { return res.status(404).send({ status: false, message: "No such review found" }) }
    
        let data = req.body
        let { reviewedBy, rating, review} = data;

        let arr = Object.keys(data)
        if(arr.length==0){ return res.status(400).send({ status: false, message: "Please enter at least one attribute to update review" }) }
        
        for(let i=0; i<arr.length; i++){
            let msg = ["reviewedBy", "rating", "review"].includes(arr[i])
            if(msg == false){return res.status(400).send({status:false, message:"It update only  reviewedBy, rating, review"})}
        }
            
        if (reviewedBy ||reviewedBy=="") {
            if (!checkName(reviewedBy)) { return res.status(400).send({ status: false, message: "Please enter a valid reviewedBy name" }) }
            data.reviewedBy = checkName(reviewedBy)
        }

        if(rating == 0 || rating){
            if (rating < 1 || rating > 5 || typeof (rating) != "number") {
                { return res.status(400).send({ status: false, message: "Please enter rating between 1 to 5" }) }
            } else {
                if (!rating) { return res.status(400).send({ status: false, message: "Please enter rating" }) }
            }
        }
    
        let reviewsData = await reviewModel.findByIdAndUpdate(reviewId, { $set: data }, { new: true })

        bookData.reviewsData = [reviewsData]
        res.status(200).send({ status: true, message: 'Success', data: bookData })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}




//******************************************************* API to delete Review ************************************************//

const deleteReview = async (req, res) => {

    try {
        let bookId = req.params.bookId;
        if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: "Please enter a valid Book Id" }) }
        let bookData = await bookModel.findOne({_id:bookId, isDeleted:false})
        if (!bookData) { return res.status(404).send({ status: false, message: "No such book found" }) }
       
        let reviewId = req.params.reviewId;
        if (!isValidObjectId(reviewId)) { return res.status(400).send({ status: false, message: "Please enter a valid review Id" }) }
        let reviewData = await reviewModel.findOne({ _id: reviewId, bookId: bookId })
        if (!reviewData) { return res.status(404).send({ status: false, message: "No such review found" }) }
        if (reviewData.isDeleted == true) { return res.status(400).send({ status: false, message: "review is alredy Deleted" }) }

        await reviewModel.findByIdAndUpdate(reviewId, { $set: { isDeleted: true, deletedAt: moment().format('YYYY-MM-DD') } })

        await bookModel.findByIdAndUpdate(bookId, { $inc: { reviews: -1 } })

        res.status(200).send({ status: true, message: 'Review Deleted'})

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}

module.exports = { createReview, updateReview, deleteReview }