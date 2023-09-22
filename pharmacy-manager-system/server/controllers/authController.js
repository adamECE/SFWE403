const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/user')
const { generateApiKey } = require('generate-api-key');



var dotenv = require('dotenv')

dotenv.config({ path: '../config/.env' }) //load config file


const secret = process.env.JWT_SECRET

//create and save new patient
exports.create = asyncHandler(async(req, res) => {

    const { firstName, lastName, email, dateOfBirth, role, phoneNumber, insuranceInformation, address } = req.body
    const password = generateApiKey({
        method: 'string',
        length: 10
    });

    //check if all the required inputs are given
    if (!firstName || !lastName || !email || !dateOfBirth || !role || !phoneNumber || !insuranceInformation || !address) {
        res.status(400).json({ error: 'Please add all Fields' })
            //throw new Error('Please add all Fields')
    } else {
        //look for user and device in the db
        const findUser = await User.findOne({ email })

        //if user already on db... trow an error
        if (findUser) {
            res.status(400).json({ error: 'User Already exist' })
                //throw new Error('User Already exist')
        } else {


            //hashing the password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            const newUser = new User({ //cretaes a new patient obj
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword,
                dateOfBirth: dateOfBirth,
                role: role,
                phoneNumber: phoneNumber,
                insuranceInformation: insuranceInformation,
                address: address

            });
            newUser.save().then(savedDoc => {
                if (savedDoc == newUser) {
                    res.status(200).json({ message: `user password is ${password}` })
                } else {
                    res.status(400).json({ error: 'bad' })
                }
            });

        }
    }
})





//this function uses jwt to generate the user auth token given the email
const generateToken = (email) => {
    return jwt.sign({ email: email }, secret, { expiresIn: '90d' })
}