const adminController = require('../../controllers/adminController.js')
const express = require('express')
const router = express.Router()
const { authenticator, authenticatedAdmin } = require('../../middleware/auth')

router.get('/signin', adminController.signInPage)
router.post('/login', adminController.login)
router.get('/logout', adminController.logout)
router.get('/index', authenticatedAdmin, adminController.adminPage)

router.get('/users/income', authenticatedAdmin, adminController.getUserIncomeRating)
router.get('/users/expense', authenticatedAdmin, adminController.getUserExpenseRating)
router.get('/category/income', authenticatedAdmin, adminController.getCatogryincomeRating)
router.get('/category/expense', authenticatedAdmin, adminController.getCatogryexpenseRating)
router.get('/user/:_id', authenticatedAdmin, adminController.getShowPage)

module.exports = router
