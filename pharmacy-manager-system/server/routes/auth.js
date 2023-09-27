const express = require('express');
const router = express.Router()
const authController = require('../controllers/authController')
const { protect, isManager, isStaff, isAccountActive } = require('../middleware/auth')
router.post('/new-patient', protect, isStaff, isAccountActive, authController.createPatient) // route to create new user account
router.post('/new-staff', protect, isManager, isAccountActive, authController.createStaff) // route to create new user account
router.post('/login', authController.login) // route for user login
router.put('/account-activation', protect, isStaff, authController.firstPasswordReset) // route for 1st pw reset for account activation
router.put('/unlock-account', protect, isManager, isAccountActive, authController.unlockAccount) // route for manager unlock staff accounts
router.post('/pw-reset-email', authController.sendPasswordResetEmail) // route for sending pw reset emails
router.put('/reset-password', authController.passwordReset) // route for resting password

module.exports = router;