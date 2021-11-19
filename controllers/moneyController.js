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
  },
  getFilteredExpense: async(req, res, next) => {
    const userId = req.user._id
    const categoryFilter = req.query.category
    let { startDate, endDate } = req.query
    if (new Date(startDate) > new Date(endDate)) {
      req.flash('error_messages', '起訖日期不正確，重新輸入')
      return  res.redirect('/')
    }
    const [filteredRecords, categories] = await Promise.all([
      Record.find({
        category: { $regex: categoryFilter },
        date: { $gte: startDate, $lte: endDate },
        userId,
        type: 'expense'
      }).lean().sort({ date: 'desc' }),
      Category.find().lean()
    ])
    filteredRecords.forEach((record) => {
      record.icon = getIconName(record.category, categories)
    })
    let totalAmount = getTotalAmount(filteredRecords)
    res.render('index', {
      records: filteredRecords,
      totalAmount,
      categoryFilter,
      startDate,
      endDate
    })
  },
  newPage: (req, res) => {
    res.render('new')
  },
  createExpense: async(req, res, next) => {
    const userId = req.user._id
    const { name, date, category, amount, merchant } = req.body
    if (name === "" || date === "" || category === "" || amount === "" || merchant === "") {
    return res.redirect('/expense/records/new')
    }
    await Record.create({ name, date, category, amount, merchant, userId, type: 'expense' })
    req.flash('success_messages', '已成功建立支出紀錄')
    res.redirect('/')
  }
  
}
module.exports = moneyController