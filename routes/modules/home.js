const moneyController = require('../../controllers/moneyController')
const express = require('express')
const router = express.Router()

router.get('/', moneyController.getExpense)

router.get('/expense/records/filter', moneyController.getFilteredExpense)

router.get('/expense/records/new', moneyController.newPage)

router.post('/expense/records', moneyController.createExpense)

module.exports = router