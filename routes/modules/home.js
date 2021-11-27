const moneyController = require('../../controllers/moneyController')
const adminController = require('../../controllers/adminController.js')
const express = require('express')
const balanceController = require('../../controllers/balanceController')
const router = express.Router()
const { authenticator, authenticatedAdmin } = require('../../middleware/auth')


router.get('/expense/records/filter', authenticator, moneyController.getFilteredExpense)

router.get('/:index/records/new', authenticator, moneyController.newPage)

router.post('/expense/records', authenticator, moneyController.createExpense)

router.get('/:index/records/:id/edit', authenticator, moneyController.editPage)

router.put('/expense/records/:id', authenticator, moneyController.putExpense)

router.delete('/records/:id', authenticator, moneyController.deleteExpense)

router.get('/income', authenticator, moneyController.getIncome)

router.get('/income/records/filter', authenticator, moneyController.getFilteredIncome)

router.get('/income/records/new', authenticator, moneyController.newPage)

router.post('/income/records', authenticator, moneyController.createIncome)

router.put('/income/records/:id', authenticator, moneyController.putIncome)

router.get('/balance', authenticator, balanceController.balancePage)

router.get('/balance/records/filter', authenticator, balanceController.getFilteredBalance)

router.get('/setting',authenticator, moneyController.getSetting )

router.get('/', authenticator, moneyController.getExpense)

module.exports = router
