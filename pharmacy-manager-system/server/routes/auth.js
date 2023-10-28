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
router.post('/two-factor', authController.sendTwoFactorEmail) // route for sending twofactor emails
router.put('/verify-two-factor', authController.checkTwoFactorCode) // route for check twofactor code
router.put('/reset-password', authController.passwordReset) // route for resting password
router.get('/patient-list', protect, isAccountActive, isStaff, authController.getPatientList) // route for list of patients
router.get('/staff-list', protect, isAccountActive, isManager, authController.getStaffList) // route for list off staff
router.get('/staff-member/:email', protect, isAccountActive, isStaff, authController.getStaffMember) // route for getting one staff given the email
router.get('/a-patient/:email', protect, isAccountActive, isStaff, authController.getAPatient) // route for getting one patient given the email
router.delete('/remove-patient/', protect, isAccountActive, isStaff, authController.removePatient) // route for removing one patient account
module.exports = router;