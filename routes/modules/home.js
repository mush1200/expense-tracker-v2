const moneyController = require('../../controllers/moneyController')
const express = require('express')
const router = express.Router()

router.get('/', moneyController.getExpense)


module.exports = router