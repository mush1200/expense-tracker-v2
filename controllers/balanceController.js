const moment = require('moment')
const Record = require('../models/record')
const Category = require('../models/category')
const { getTotalAmount, getTotalBalance, getIconName, getIncomeCategorizedSum, getExpenseCategorizedSum } = require('../public/javascripts/helper')

const balanceController = {
  balancePage: async (req, res, next) => {
    try {
      const userId = req.user._id
      const [records, categories] = await Promise.all([Record.find({ userId }).lean().sort({ date: 'desc' }), Category.find().lean()])
      const index = 'balance'
      // processing records
      records.forEach((record) => {
        record.icon = getIconName(record.category, categories)
      })
      // processing chart data
      const isIncomeRecordPresent = records.some((record) => record.type === 'income')
      const isExpenseRecordPresent = records.some((record) => record.type === 'expense')
      const incomeCategorizedSum = getIncomeCategorizedSum(records)
      const expenseCategorizedSum = getExpenseCategorizedSum(records)
      // processing other data
      const totalAmount = getTotalBalance(records)
      const startDate = '2021-01-01'
      const endDate = moment().format('YYYY-MM-DD')
      res.render('balance', {
        records,
        isIncomeRecordPresent,
        isExpenseRecordPresent,
        incomeCategorizedSum,
        expenseCategorizedSum,
        totalAmount,
        startDate,
        endDate,
        index
      })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  getFilteredBalance: async(req, res, next) => {
    const userId = req.user._id
    const index = 'balance'
    let { startDate, endDate } = req.query
    if (new Date(startDate) > new Date(endDate)) {
      req.flash('error_messages', '起訖日期不正確，重新輸入')
      return  res.redirect('back')
    }
    const [filteredRecords, categories] = await Promise.all([
      Record.find({
        date: { $gte: startDate, $lte: endDate },
        userId,
      }).lean().sort({ date: 'desc' }),
      Category.find().lean()
    ])
    filteredRecords.forEach((record) => {
      record.icon = getIconName(record.category, categories)
    })
    const totalAmount = getTotalAmount(filteredRecords)
    const isIncomeRecordPresent = filteredRecords.some((record) => record.type === 'income')
    console.log(isIncomeRecordPresent)
    const isExpenseRecordPresent = filteredRecords.some((record) => record.type === 'expense')
    console.log(isExpenseRecordPresent)
    const incomeCategorizedSum = getIncomeCategorizedSum(filteredRecords)
    const expenseCategorizedSum = getExpenseCategorizedSum(filteredRecords)

    res.render('balance', {
      records: filteredRecords,
      isIncomeRecordPresent,
      isExpenseRecordPresent,
      incomeCategorizedSum,
      expenseCategorizedSum,
      totalAmount,
      startDate,
      endDate,
      index
    })
  }
}
module.exports = balanceController