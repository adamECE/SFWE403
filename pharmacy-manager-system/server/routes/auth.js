const express = require('express');
const router = express.Router()
const authController = require('../controllers/authController')
const { protect, isManager, isStaff, isAccountActive } = require('../middleware/auth')
router.post('/new-patient', protect, isStaff, isAccountActive, authController.createPatient) // route to create new user account
router.post('/new-staff', protect, isManager, isAccountActive, authController.createStaff) // route to create new user account
router.post('/login', authController.login) // route for user login

module.exports = router;