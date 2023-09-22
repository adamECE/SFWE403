const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/user')
const { generateApiKey } = require('generate-api-key');
const { ROLES } = require('../config/pharmacy0x2Const')
var dotenv = require('dotenv')
dotenv.config({ path: '../config/.env' })


//create and save new staff
exports.createStaff = asyncHandler(async(req, res) => {

    const { firstName, lastName, email, dateOfBirth, role, phoneNumber, address } = req.body
    const password = generateApiKey({
        method: 'string',
        length: 10
    });

    //check if all the required inputs are given
    if (!firstName || !lastName || !email || !dateOfBirth || !role || !phoneNumber || !address) {
        res.status(400).json({ error: 'Please add all Fields' })
            //throw new Error('Please add all Fields')
    } else {

        if (Object.values(ROLES).includes(role.toLowerCase()) && role != ROLES.PATIENT) {
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

                const newStaff = new User({ //cretaes a new staff obj
                    firstName: firstName,
                    lastName: lastName,
                    email: email.toLowerCase(),
                    password: hashedPassword,
                    dateOfBirth: dateOfBirth,
                    role: role.toLowerCase(),
                    phoneNumber: phoneNumber,
                    address: address

                });
                newStaff.save().then(savedDoc => {
                    if (savedDoc == newStaff) {
                        res.status(200).json({ message: `user password is ${password}` })
                    } else {
                        res.status(400).json({ error: 'bad' })
                    }
                });

            }
        } else {
            res.status(400).json({ error: 'Incorrect Staff role' })
        }
    }
})


exports.createPatient = asyncHandler(async(req, res) => {

    const { firstName, lastName, email, dateOfBirth, phoneNumber, insuranceInformation, address } = req.body
    const password = generateApiKey({
        method: 'string',
        length: 10
    });

    //check if all the required inputs are given
    if (!firstName || !lastName || !email || !dateOfBirth || !phoneNumber || !insuranceInformation || !address) {
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

            const newPatient = new User({ //creates a new patient obj
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword,
                dateOfBirth: dateOfBirth,
                role: ROLES.PATIENT,
                phoneNumber: phoneNumber,
                insuranceInformation: insuranceInformation,
                address: address

            });
            newPatient.save().then(savedDoc => {
                if (savedDoc == newPatient) {
                    res.status(200).json({ message: `patient account created sucessfully!` })
                } else {
                    res.status(400).json({ error: 'bad' })
                }
            });

        }
    }
})

//staff login
exports.login = asyncHandler(async(req, res) => {
    const { email, password } = req.body // get the given user name and password

    // try to find the user for user email
    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) { //if the user was found and the given password match the saved hash


        //check if account is locked
        if (user.isLocked) {
            res.status(400).json({ error: "Your account is locked! Please contact your manager" })
            return
        } else {
            user.lastLogin = new Date();
            user.loginAttempts = 0 //reset the login attempts counter
            await user.save()
            res.status(200).json({
                    email: user.email,
                    token: await generateToken(user.email), //generates a token for the user session
                    role: user.role,
                    isACCountActive: user.isActive
                }) //returns the user email,role, account status, and the auth token
            return
        }
    } else {
        //if the user password is incorrect
        if (user && !(await bcrypt.compare(password, user.password))) {
            user.loginAttempts++ //record the incorrect login attemt
                if (user.loginAttempts >= 5) //if more than 5 incorrect login attempts were recorded
                    user.isLocked = true //lock the account
            await user.save() //update user information
        }
        res.status(400).json({ error: "Invalid credentials" })
    }
})

exports.firstPasswordReset = asyncHandler(async(req, res) => {
        const { currentpassword, newPassword, confirmPassword } = req.body
        if (newPassword != confirmPassword) {
            res.status(400).json({ error: "New Password dont match!" })
            return
        }

        // try to find the user for user email
        const user = await User.findOne({ "email": req.user.email })

        if (user && (await bcrypt.compare(currentpassword, user.password))) {

            //hashing the password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(newPassword, salt)
            user.password = hashedPassword
            user.isActive = true
            await user.save()
            res.status(200).json({
                message: " Password has been reset and your account was activated!"
            })

        } else {

            res.status(400).json({ error: "Incorrect Current Password" })
        }
    })
    //this function uses jwt to generate the user auth token given the email
const generateToken = async(email) => {
    return jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '90d' })
}