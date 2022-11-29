const userModel = require("../model/userModel")
const jwt = require("jsonwebtoken")




//--------Function for Email Validation------------//

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
    return re.test(email);
}

//--------Function for Password------------------//
function checkPassword(str) {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
    return re.test(str);
}


//----------API to create user--------------------//

const createUser = async (req, res) => {
    try {
        let data = req.body;
        if(Object.keys(data).length==0){return res.status(400).send({ status: false, message: "Please provide user details to resister user" })}

        let {title, name, phone, email, password, address:{street, city, pincode}} = data;

        if(!title){return res.status(400).send({ status: false, message: "Please enter user title" })}
        if(!name){return res.status(400).send({ status: false, message: "Please enter user name" })}
        if(!phone){return res.status(400).send({ status: false, message: "Please enter user phone" })}
        if(!email){return res.status(400).send({ status: false, message: "Please enter user email" })}
        if(!password){return res.status(400).send({ status: false, message: "Please enter user password" })}
        
        let enumArr = userModel.schema.obj.title.enum;
        if(!enumArr.includes(title)){return res.status(400).send({ status: false, message: "Please enter a valid user title" })}

        let checkName = name.match(/[0-9]/)   //replace the rejex
        if(checkName){return res.status(400).send({ status: false, message: "Please enter a valid user name" })}
        name = name.trim()
        name = name.replace(name[0], name[0].toUpperCase())

        let checkPhone = phone.match(/[a-z]/)
        if(phone.length != 10 || checkPhone){return res.status(400).send({ status: false, message: "Please enter a valid phone number" })}
        
        let userByPhone = await userModel.findOne({phone:phone})
        if(userByPhone){return res.status(400).send({ status: false, message: "Phone number alredy exits, please enter another number" })}

        if(!validateEmail(email)){return res.status(400).send({ status: false, message: "Please enter a valid user email" })}

        let userByEmail = await userModel.findOne({email:email})
        if(userByEmail){return res.status(400).send({ status: false, message: "Email alredy exits, please enter another email" })}

        if(!checkPassword(password)){return res.status(400).send({ status: false, message: "Please enter a valid password"})}

        let checkPincode = pincode.match(/[a-z]/)
        if(pincode.length != 6 || checkPincode){return res.status(400).send({ status: false, message: "Please enter a valid pincode number" })}
        
        let result = await userModel.create(data)
        res.status(201).send({status:true, message:'Success', data:result})

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}




const userLogin = async (req, res) => {
    try {
        const {email , password} = req.body
        if(Object.keys(req.body).length == 0 ){return res.status(400).send({status : false , message : 'Please provide email and password to login'})}

        if(!email) return res.status(400).send({status : false , message : 'Email Mandatory!'})
        if(!password) return res.status(400).send({status : false , message : 'Password Mandatory !'})

        if(!validateEmail(email))  return res.status(400).send({status : false , message : 'Please enter valid email !'})
        if(!checkPassword(password)) return res.status(400).send({status : false , message : 'Please enter valid Password !'})
        
        const userData = await userModel.findOne({email: email})
        if(!userData){return res.status(404).send({status:false, message:"User not found"})}

        if(userData.password != password){return res.status(400).send({status:false, message:"Please enter correct Password !"})}

        const token = jwt.sign({ userId: userData._id }, "book management", {expiresIn:"24h"})
        res.status(200).send({ status: true, message: 'Success', data: token })
        
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
module.exports = { createUser, userLogin }























// const userLogin = async (req, res) => {
//     try {
//         let data = req.body
//         let email = data.email
//         let pass = data.password

//         let userData = await userModel.findOne({ email: email, password: pass })

//         let token = jwt.sign({ userId: userData._id }, "book management", {expiresIn:"24h"})

//         res.status(200).send({ status: true, message: 'Success', data: token })
//     } catch (err) {
//         res.status(500).send({ status: false, message: err.message })
//     }
// }
module.exports = { createUser, userLogin }
