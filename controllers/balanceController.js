const moment = require('moment')
const Record = require('../models/record')
const Category = require('../models/category')
const { getAccountingFormat, getTotalBalance, getIconName, getIncomeCategorizedSum, getExpenseCategorizedSum } = require('../public/javascripts/helper')

const balanceController = {
  balancePage: async (req, res, next) => {
    try {
      const userId = req.user._id
      const [records, categories] = await Promise.all([Record.find({ userId }).lean().sort({ date: 'desc' }), Category.find().lean()])

      // processing records
      records.forEach((record) => {
        record.icon = getIconName(record.category, categories)
        record.date = moment(record.date).format('YYYY-MM-DD')
      })
      // processing chart data
      const isIncomeRecordPresent = records.some((record) => record.type === 'income')
      const isExpenseRecordPresent = records.some((record) => record.type === 'expense')
      const incomeCategorizedSum = getIncomeCategorizedSum(records)
      const salary = incomeCategorizedSum.salary
      const expenseCategorizedSum = getExpenseCategorizedSum(records)
      // processing other data
      const totalAmount = getAccountingFormat(getTotalBalance(records))
      const defaultStartDate = '2021-01-01'
      const today = moment().format('YYYY-MM-DD')
      res.render('balance', {
        records,
        isIncomeRecordPresent,
        isExpenseRecordPresent,
        incomeCategorizedSum,
        expenseCategorizedSum,
        totalAmount,
        startDate: defaultStartDate,
        endDate: today
      })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  
}
module.exports = balanceController