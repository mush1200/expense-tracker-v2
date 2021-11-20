const moneyController = require('../../controllers/moneyController')
const express = require('express')
const router = express.Router()

router.get('/', moneyController.getExpense)

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

module.exports = router
