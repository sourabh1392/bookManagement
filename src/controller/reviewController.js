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
        if(!bookData){return res.status(404).send({status:false, message:"No such book found"})}
        
        let {reviewedBy, rating, review} = data;
 
        if(!reviewedBy){data.reviewedBy = "Guest"}
        if(!rating){return res.status(400).send({status:false, message:"Please enter rating"})}
             
        let checkName = reviewedBy.match(/[0-9]/)  
        if(checkName){return res.status(400).send({ status: false, message: "Please enter a valid reviewer's name" })}
        data.reviewedBy = reviewedBy.trim()
        data.reviewedBy = reviewedBy.replace(reviewedBy[0], reviewedBy[0].toUpperCase())

        if(rating<1 || rating>5 || typeof(rating)!="number"){return res.status(400).send({status:false, message:"Please enter a valid rating"})}

        data.bookId = bookId
        data.reviewedAt = moment().format("YYYY-MM-DD")

        await reviewModel.create(data)
        let reviewsData = await reviewModel.find({ bookId: bookId }).select({isDeleted:0, __v:0})

        let reviews = bookData.reviews + 1
        let updateBook = await bookModel.findByIdAndUpdate(bookId, { $set: { reviews: reviews } }, { new: true }).lean()

        updateBook.reviewsData = reviewsData

        res.status(200).send({ status: true, message: 'Success', data: updateBook })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}



const updateReview = async (req, res) => {

    try {
        let bookId = req.params.bookId;
        if(!isValidObjectId(bookId)){return res.status(400).send({status:false, message:"Please enter a valid Book Id"})}
        let bookData = await bookModel.findById(bookId).lean()
        if(!bookData){return res.status(404).send({status:false, message:"No such book found"})}
        if(bookData.isDeleted == true){return res.status(400).send({status:false, message:"Book is Deleted"})}
        if (bookData.reviews == 0){return res.status(400).send({status:false, message:"No review for this book"})}

        let reviewId = req.params.reviewId;
        if(!isValidObjectId(reviewId)){return res.status(400).send({status:false, message:"Please enter a valid review Id"})}
        let reviewData = await reviewModel.findById(reviewId)
        if(!reviewData){return res.status(404).send({status:false, message:"No such review found"})}
        if(reviewData.isDeleted == true){return res.status(400).send({status:false, message:"review is Deleted"})}
        
        let data = req.body
        let {reviewedBy, rating} = data;
            
        if(reviewedBy){
            let checkName = reviewedBy.match(/[0-9]/)  
            if(checkName){return res.status(400).send({ status: false, message: "Please enter a valid reviewer's name" })}
            data.reviewedBy = reviewedBy.trim()
            data.reviewedBy = reviewedBy.replace(reviewedBy[0], reviewedBy[0].toUpperCase())
        }
        if(rating){
            if( rating==0 ){return res.status(400).send({status:false, message:"Please enter a valid rating"})}
        }

        // if(rating){
        //     if(!/^[1-5]{1}$/.test(rating)){return res.status(400).send({status:false, message:"Please enter a valid rating"})}
        // }
        
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
        if(!isValidObjectId(bookId)){return res.status(400).send({status:false, message:"Please enter a valid Book Id"})}
        let bookData = await bookModel.findById(bookId)
        if(!bookData){return res.status(404).send({status:false, message:"No such book found"})}
        if(bookData.isDeleted == true){return res.status(400).send({status:false, message:"Book is Deleted"})}
        if (bookData.reviews == 0){return res.status(400).send({status:false, message:"No review for this book"})}
        
        
        let reviewId = req.params.reviewId;
        if(!isValidObjectId(reviewId)){return res.status(400).send({status:false, message:"Please enter a valid review Id"})}
        let reviewData = await reviewModel.findById(reviewId)
        if(!reviewData){return res.status(404).send({status:false, message:"No such review found"})}
        if(reviewData.isDeleted == true){return res.status(400).send({status:false, message:"review is alredy Deleted"})}

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