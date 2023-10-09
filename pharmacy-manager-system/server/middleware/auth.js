//this file contains the middleware functions to protect the routes 
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/user')
var dotenv = require('dotenv')
dotenv.config({ path: '../config/.env' })
const { ROLES } = require('../config/pharmacy0x2Const')

//check if the user is authenticated and if the given token is valid--this function is used to retrict access to non auth users to the routes
exports.protect = asyncHandler(async(req, res, next) => {
    let token
    if (
        (req.headers.authorization || req.headers.Authorization) &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1]
                // Verify token
            decoded = jwt.verify(token, process.env.JWT_SECRET)
                // Get user from the token
            req.user = await User.findOne({ "email": decoded.email }).select('-password -prescriptions')
            next()
        } catch (error) {
            res.status(401).json({ error: 'Not authorized' })
        }
    }
    if (!token) {
        res.status(401).json({ error: 'Not authorized, no token' })

    }

})

//this function check if the user is a staff member
exports.isStaff = asyncHandler(async(req, res, next) => {
    if (Object.values(ROLES).includes(req.user.role.toLowerCase()) && req.user.role != ROLES.PATIENT)
        next()
    else {
        res.status(401).json({ error: 'Not authorized: user is not a staff member' })

    }
})

//this function check if the user is a pharmacy manager
exports.isManager = asyncHandler(async(req, res, next) => {
    if (Object.values(ROLES).includes(req.user.role.toLowerCase()) && req.user.role == ROLES.PHARMACY_MANAGER)
        next()
    else {
        res.status(401).json({ error: 'Not authorized: user is not a pharmacy manager' })

    }
})

exports.isAccountActive = asyncHandler(async(req, res, next) => {
    if (req.user.isActive)
        next()
    else {
        res.status(401).json({ error: 'Not authorized: user account was not activated!' })

    }
})

exports.isPharmacist = asyncHandler(async(req, res, next) => {
    if (Object.values(ROLES).includes(req.user.role.toLowerCase()) && req.user.role == ROLES.PHARMACIST)
        next()
    else {
        res.status(401).json({ error: 'Not authorized: user is not a pharmacist' })

    }
})