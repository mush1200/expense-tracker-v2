const moneyController = require('../../controllers/moneyController')
const adminController = require('../../controllers/adminController.js')
const express = require('express')
const balanceController = require('../../controllers/balanceController')
const router = express.Router()
const { authenticator } = require('../../middleware/auth')


router.get('/expense/records/filter', moneyController.getFilteredExpense)

router.get('/:index/records/new', moneyController.newPage)

router.post('/expense/records', moneyController.createExpense)

router.get('/:index/records/:id/edit', moneyController.editPage)

router.put('/expense/records/:id',moneyController.putExpense)

router.delete('/records/:id', moneyController.deleteExpense)

router.get('/income', moneyController.getIncome)

router.get('/income/records/filter', moneyController.getFilteredIncome)

router.get('/income/records/new', moneyController.newPage)

router.post('/income/records', moneyController.createIncome)

router.put('/income/records/:id', moneyController.putIncome)

router.get('/balance', balanceController.balancePage)

router.get('/balance/records/filter', balanceController.getFilteredBalance)

// admin

const authenticatedAdmin = (req, res, next) => {
  console.log(req.isAuthenticated())
  console.log(req.user)
  if (req.isAuthenticated()) {
    if (req.user.isAdmin === '1') {
      console.log(req.user.isAdmin)
      return next() }
    req.flash('error_messages', '此帳號非管理者帳號！')
    return res.redirect('/')
  }
  res.redirect('/admin/signin')
}
router.get('/admin/signin', adminController.signInPage)
router.post('/admin/login', adminController.login)
router.get('/admin/logout', adminController.logout)
router.get('/admin/index', authenticatedAdmin, adminController.adminPage)
router.get('/', authenticator, moneyController.getExpense)

module.exports = router
