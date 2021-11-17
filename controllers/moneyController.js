const moment = require('moment')
const Record = require('../models/record')
const Category = require('../models/category')
const { getIconName, getTotalAmount } = require('../public/javascripts/helper')
const moneyController = {
  getExpense: async(req, res,next) => {
    const userId = req.user._id
    const [ records, categories] = await Promise.all([
      Record.find({
        userId,
        type: 'expense'
      }).lean().sort({ date: 'desc' }),
      Category.find().lean()
    ])
    records.forEach((record) => {
      record.icon = getIconName(record.category, categories)
    })
    const totalAmount = getTotalAmount(records)
    const startDate = '2021-01-01'
    const endDate = moment().format('YYYY-MM-DD')
    return res.render('index', {
      records,
      totalAmount,
      startDate,
      endDate
    })
  }
  
}
module.exports = moneyController