const moment = require('moment')
const Record = require('../models/record')
const Category = require('../models/category')
const { getIconName, getTotalAmount } = require('../public/javascripts/helper')
const User = require('../models/user')
const moneyController = {
  getExpense: async(req, res, next) => {
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
    const index = "expense"
    return res.render('index', {
      records,
      totalAmount,
      startDate,
      endDate,
      index
    })
  },
  getFilteredExpense: async(req, res, next) => {
    const userId = req.user._id
    const categoryFilter = req.query.category
    let { startDate, endDate } = req.query
    const index = "expense"
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
      endDate,
      index
    })
  },
  newPage: (req, res) => {
    const index = req.params.index
    res.render('new', {
      index
    })
  },
  createExpense: async(req, res, next) => {
    const userId = req.user._id
    const { name, date, category, amount, merchant } = req.body
    if (name === "" || date === "" || category === "" || amount === "" || merchant === "") {
    return res.redirect('/expense/records/new')
    }
    const record = await Record.create({ name, date, category, amount, merchant, userId, type: 'expense' })
    const user = await User.findOne({_id: userId})
    user.records.push(record._id)
    await user.save()
    req.flash('success_messages', '已成功建立支出紀錄')
    res.redirect('/')
  },
  editPage: async(req, res, next) => {
    const userId = req.user._id
    const _id = req.params.id
    const index = req.params.index
    const record = await Record.findOne({ _id, userId }).lean()
    return res.render('edit', {
      record,
      index
    })
  },
  putExpense: async(req, res, next) => {
    const userId = req.user._id
    const _id = req.params.id
    const { name, category, date, amount, merchant } = req.body
    const index = 'expense'
    if (name === "" || date === "" || category === "" || amount === "" || merchant === "") {
      return res.render('edit', {
        name,
        category,
        date,
        amount,
        merchant,
        index
      })
    }
    const record = await Record.findOne({ _id, userId })
    record.name = name
    record.category = category
    record.date = date
    record.amount = amount
    record.merchant = merchant
    await record.save()
    req.flash('success_messages', '已成功修改支出紀錄')
    res.redirect('/')
  },
  deleteExpense: async(req, res, next) => {
    const userId = req.user._id
    const _id = req.params.id
    const record = await Record.findOne({ _id, userId })
    await record.remove()
    req.flash('success_messages', '已成功刪除紀錄')
    return res.redirect('back')
  },
  getIncome: async(req, res, next) => {
    const userId = req.user._id
    const [ incomeRecords, categories] = await Promise.all([
      Record.find({
        userId,
        type: 'income'
      }).lean().sort({ date: 'desc' }),
      Category.find().lean()
    ])
    incomeRecords.forEach((incomeRecord) => {
      incomeRecord.icon = getIconName(incomeRecord.category, categories)
    })
    const totalAmount = getTotalAmount(incomeRecords)
    const startDate = '2021-01-01'
    const endDate = moment().format('YYYY-MM-DD')
    const index = "income"
    return res.render('index', {
      records: incomeRecords,
      totalAmount,
      startDate,
      endDate,
      index
    })
  },
  getFilteredIncome: async(req, res, next) => {
    const userId = req.user._id
    const categoryFilter = req.query.category
    const index = "income"
    let { startDate, endDate } = req.query
    if (new Date(startDate) > new Date(endDate)) {
      req.flash('error_messages', '起訖日期不正確，重新輸入')
      return  res.redirect('/income')
    }
    const [filteredRecords, categories] = await Promise.all([
      Record.find({
        category: { $regex: categoryFilter },
        date: { $gte: startDate, $lte: endDate },
        userId,
        type: 'income'
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
      endDate,
      index
    })
  },
  createIncome: async(req, res, next) => {
    const userId = req.user._id
    const { name, date, category, amount, merchant } = req.body
    if (name === "" || date === "" || category === "" || amount === "" || merchant === "") {
    return res.redirect('/income/records/new')
    }
    const record = await Record.create({ name, date, category, amount, merchant, userId, type: 'income' })
    const user = await User.findOne({_id: userId})
    user.records.push(record._id)
    await user.save()
    req.flash('success_messages', '已成功建立收入紀錄')
    res.redirect('/income')
  },
  putIncome: async(req, res, next) => {
    const userId = req.user._id
    const _id = req.params.id
    const index = "income"
    const { name, category, date, amount, merchant } = req.body
    if (name === "" || date === "" || category === "" || amount === "" || merchant === "") {
      return res.render('edit', {
        name,
        category,
        date,
        amount,
        merchant,
        index
      })
    }
    const record = await Record.findOne({ _id, userId })
    record.name = name
    record.category = category
    record.date = date
    record.amount = amount
    record.merchant = merchant
    await record.save()
    req.flash('success_messages', '已成功修改收入紀錄')
    res.redirect('/income')
  }
}
module.exports = moneyController