const moment = require('moment')
const bcrypt = require('bcryptjs')
const Record = require('../models/record')
const Category = require('../models/category')
const { getIconName, getTotalAmount, userFilter, getAccountingFormat } = require('../public/javascripts/helper')
const User = require('../models/user')
const moneyController = {
  getExpense: async(req, res, next) => {
    try {
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
      const totalAmount = getAccountingFormat(getTotalAmount(records))
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
    } catch(err) {
      console.log(err)
      next(err)
    }
  },
  getFilteredExpense: async(req, res, next) => {
    try {
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
      let totalAmount = getAccountingFormat(getTotalAmount(filteredRecords))
      res.render('index', {
        records: filteredRecords,
        totalAmount,
        categoryFilter,
        startDate,
        endDate,
        index
      })
    } catch(err) {
      console.log(err)
      next(err)
    }
  },
  newPage: (req, res) => {
    const index = req.params.index
    res.render('new', {
      index
    })
  },
  createExpense: async(req, res, next) => {
    try {
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
    } catch(err) {
      console.log(err)
      next(err)
    }
  },
  editPage: async(req, res, next) => {
    try {
      const userId = req.user._id
      const _id = req.params.id
      const index = req.params.index
      const record = await Record.findOne({ _id, userId }).lean()
      return res.render('edit', {
        record,
        index
      })
    } catch(err) {
      console.log(err)
      next(err)
    }
  },
  putExpense: async(req, res, next) => {
    try {
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
    } catch(err) {
      console.log(err)
      next(err)
    }
  },
  deleteExpense: async(req, res, next) => {
    try {
      const userId = req.user._id
      const _id = req.params.id
      const record = await Record.findOne({ _id, userId })
      await record.remove()
      const user = await User.findOne({ _id: userId })
      user.records = user.records.filter(record => record.toString() !== _id)
      await user.save()
      req.flash('success_messages', '已成功刪除紀錄')
      return res.redirect('back')
    } catch(err) {
      console.log(err)
      next(err)
    }
  },
  getIncome: async(req, res, next) => {
    try {
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
      const totalAmount = getAccountingFormat(getTotalAmount(incomeRecords))
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
    } catch(err) {
      console.log(err)
      next(err)
    }
  },
  getFilteredIncome: async(req, res, next) => {
    try {
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
      let totalAmount = getAccountingFormat(getTotalAmount(filteredRecords))
      res.render('index', {
        records: filteredRecords,
        totalAmount,
        categoryFilter,
        startDate,
        endDate,
        index
      })
    } catch(err) {
      console.log(err)
      next(err)
    }
  },
  createIncome: async(req, res, next) => {
    try {
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
    } catch(err) {
      console.log(err)
      next(err)
    }
  },
  putIncome: async(req, res, next) => {
    try {
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
    } catch(err) {
      console.log(err)
      next(err)
    }
  },
  getSetting: async(req, res, next) => {
    try {
      const index = 'setting'
      const _id = req.user._id
      const user = await User.findOne({ _id }).lean()
      const { name, email } = user
      return res.render('setting', { name, email, index })
    } catch(err) {
      console.log(err)
      next(err)
    }
  },
  putSetting: async (req, res, next) => {
    try {
      const _id = req.user._id
      const { name, newEmail, password, confirmPassword } = req.body
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/
      let errors = []
      if (!name || !newEmail) {
        errors.push({ message: '姓名/Email不可空白。' })
      }
      if (name.length > 32) {
        errors.push({ message: '不可大於32字元。' })
      }
      const users = await User.find({ _id: { $ne: _id } })
      const userFilterData = userFilter(users, newEmail)
      if (userFilterData.length > 0) {
        errors.push({ message: '這個信箱已經存在了。' })
      }
      if (errors.length) {
        return res.render('setting', { errors, name, newEmail, password, confirmPassword })
      }
      const user = await User.findOne( _id )
      if (password === "") {
        await user.updateOne({
          name: name,
          email: newEmail
        })
        req.flash('success_messages', '成功更新個人資料設定！')
        return res.redirect('/setting')
      } else {
        let errors = []
        if (!regex.test(password)) {
          errors.push({ message: '密碼至少8碼，至少1個大寫字母，1個小寫字母和1個數字！' })
        }
        if (password !== confirmPassword) {
          errors.push({ message: '密碼及確認密碼不一致！' })
        }
        if (errors.length) {
          return res.render('setting', { errors, name, newEmail, password, confirmPassword })
        }
        await user.updateOne({
          name, email: newEmail,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        })
        req.flash('success_messages', '成功更新個人資料設定！')
        return res.redirect('/setting')
      }
    } catch (error) {
      console.warn(error)
    }

  }
}
module.exports = moneyController