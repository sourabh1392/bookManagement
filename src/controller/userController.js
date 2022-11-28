const userModel = require("../model/userModel")
const jwt = require("jsonwebtoken")

const createUser = async (req, res) => {
    try {
        let data = req.body;
        let result = await userModel.create(data)
        res.status(201).send({ status: true, message: 'Success', data: result })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const userLogin = async (req, res) => {
    try {
        let data = req.body
        let email = data.email
        let pass = data.password

        let userData = await userModel.findOne({ email: email, password: pass })

        let token = jwt.sign({ userId: userData._id }, "book management", {expiresIn:"24h"})

        res.status(200).send({ status: true, message: 'Success', data: token })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
module.exports = { createUser, userLogin }
