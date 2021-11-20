const moneyController = require('../../controllers/moneyController')
const express = require('express')
const router = express.Router()

router.get('/', moneyController.getExpense)

router.get('/expense/records/filter', moneyController.getFilteredExpense)

router.get('/expense/records/new', moneyController.newPage)

router.post('/expense/records', moneyController.createExpense)

router.get('/expense/records/:id/edit', moneyController.editPage)

router.put('/expense/records/:id',moneyController.putExpense)

router.delete('/expense/records/:id', moneyController.deleteExpense)

router.get('/income', moneyController.getIncome)

router.get('/income/records/filter', moneyController.getFilteredIncome)

module.exports = router
