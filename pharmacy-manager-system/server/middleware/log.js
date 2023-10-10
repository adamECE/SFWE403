//log middleware goes here

//this file contains the middleware functions to protect the routes 
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/user')
var dotenv = require('dotenv')
dotenv.config({ path: '../config/.env' })
const { ROLES } = require('../config/pharmacy0x2Const')
    /*

     req.logger = {
                pharmacistEmail
                prescriptionID
                patientName
                filledDateTime
                itemType
                quantity

            }
    */

exports.logPrescription = asyncHandler(async(req, res, next) => {
    console.log(req.logger)
        //add code to save logger info into db
    res.status(200).json({ message: "Your Prescription has been filled" });

})