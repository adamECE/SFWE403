const express = require('express');
const router = express.Router()
const authController = require('../controllers/authController')
    //const { protect, role } = require('../middleware/auth')
router.post('/create', authController.create) // route to create new user account
module.exports = router;