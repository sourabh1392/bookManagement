const userModel = require("../model/userModel")
const jwt = require("jsonwebtoken")
const {validateEmail, checkPassword, checkName, checkPhone, isValidAddress} = require("../validator/validation")




//******************************************************* API to create User ************************************************//

const createUser = async (req, res) => {
    try {
        let data = req.body;
        if (Object.keys(data).length == 0){ return res.status(400).send({ status: false, message: "Please provide user details to resister user" }) }

        let { title, name, phone, email, password, address} = data;

        if (!title) { return res.status(400).send({ status: false, message: "Please enter user title" }) }
        
        let enumArr = userModel.schema.obj.title.enum;
        if (!enumArr.includes(title.trim())) { return res.status(400).send({ status: false, message: "Please enter a valid user title" }) }

        if (!name ) { return res.status(400).send({ status: false, message: "Please enter user name" }) }
        if(!checkName(name)){ return res.status(400).send({ status: false, message: "Please enter a valid user name" }) }
        data.name = checkName(name)
        
        if (!phone) { return res.status(400).send({ status: false, message: "Please enter user phone" }) }
        if(!checkPhone(phone)) { return res.status(400).send({ status: false, message: "Please enter a valid phone number" }) }

        let userByPhone = await userModel.findOne({ phone :phone })
        if (userByPhone) { return res.status(400).send({ status: false, message: "Phone number alredy exits, please enter another phone number" }) }
        
        if (!email) { return res.status(400).send({ status: false, message: "Please enter user email" }) }
        if (!validateEmail(email)) { return res.status(400).send({ status: false, message: "Please enter a valid user email" }) }
       
        let userByEmail = await userModel.findOne({ email: email })
        if (userByEmail) { return res.status(400).send({ status: false, message: "Email alredy exits, please enter another email" }) }

        if (!password) { return res.status(400).send({ status: false, message: "Please enter user password" }) }
        if (!checkPassword(password)) { return res.status(400).send({ status: false, message: "Please enter a valid password" }) }
        
        if (address) {
            if(typeof(address) != "object"){ return res.status(400).send({ status: false, message: "address should be an object" }) }
            
            let { street, city, pincode } = address
            if(street){
                if (!isValidAddress(street)) { return res.status(400).send({status: false, message: "Please Enter valid Street !" }) }
            }
            if(city){
                if(!isValidAddress(city)){ return res.status(400).send({status: false, message: "Please Enter valid City Name !" }) }
            }
            if(pincode){
                if (!/^[0-9]{6}$/.test(pincode)){return res.status(400).send({ status: false, message: "Please Enter valid Pin-Code !" })}
            }
        }

        let result = await userModel.create(data)
        res.status(201).send({ status: true, message: 'Success', data: result })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}




//******************************************************* API to user login ************************************************//

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (Object.keys(req.body).length == 0) { return res.status(400).send({ status: false, message: 'Please provide email and password to login' }) }

        if (!email) return res.status(400).send({ status: false, message: 'Email Mandatory!' })
        if (!validateEmail(email)) return res.status(400).send({ status: false, message: 'Please enter valid email !' })

        if (!password) return res.status(400).send({ status: false, message: 'Password Mandatory !' })
        if (!checkPassword(password)) return res.status(400).send({ status: false, message: 'Please enter valid Password !' })

        const userData = await userModel.findOne({ email: email })
        if (!userData) { return res.status(404).send({ status: false, message: "User not found" }) }

        if (userData.password != password) { return res.status(400).send({ status: false, message: "Please enter correct Password !" }) }

        const token = jwt.sign({ userId: userData._id }, "book management", { expiresIn: "24h" })
        res.status(200).send({ status: true, message: 'Success', data: token })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createUser, userLogin }