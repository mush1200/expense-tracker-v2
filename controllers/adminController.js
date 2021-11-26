const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../models/user.js')
const Record = require('../models/record')
const Category = require('../models/category')
const { getIconName, getTotalAmount, getIncomeCategorizedSum, getExpenseCategorizedSum } = require('../public/javascripts/helper')
const adminController = {
  getShowPage: async (req, res, next) => {
    const index = 'userList'
    const userId = req.params._id
    const [ records, categories ] = await Promise.all([Record.find({ userId }).sort({ date: 'desc' }).lean(), Category.find().lean()])
    records.forEach((record) => {
        record.icon = getIconName(record.category, categories)
    })
     // processing chart data
    const isIncomeRecordPresent = records.some((record) => record.type === 'income')
    const isExpenseRecordPresent = records.some((record) => record.type === 'expense')
    const incomeCategorizedSum = getIncomeCategorizedSum(records)
    const expenseCategorizedSum = getExpenseCategorizedSum(records)
    return res.render('admin/show', { 
      records,
      isIncomeRecordPresent,
      isExpenseRecordPresent,
      incomeCategorizedSum,
      expenseCategorizedSum,
      index
    })
  },
  getUserIncomeRating: async (req, res, next) => {
    const index = "userRating"
    const users = await User.find({
      isAdmin: '0'
    }).populate({
      path: 'records',
      match: { type: { $ne: 'income' } },
      select: 'amount'
    }).lean()
    const usersIncomeAmount = []
    for (i = 0; i < users.length; i++) {
      let data = {
        name: users[i].name,
        amount: getTotalAmount(users[i].records)
      }
      usersIncomeAmount.push(data)
    }
    const sortList = usersIncomeAmount.sort(function (a, b) {
      return a.amount > b.amount ? -1 : 1;
    })
    for (let i = 0; i < sortList.length; i++) {
      sortList[i].rating = i + 1
    }
    res.render('admin/userIncomeRating', { sortList, index })
  },
  getUserExpenseRating: async (req, res, next) => {
    const index = "userRating"
    const users = await User.find({
      isAdmin: '0'
    }).populate({
      path: 'records',
      match: { type: { $ne: 'expense' } },
      select: 'amount'
    }).lean()
    const usersExpenseAmount = []
    for (i = 0; i < users.length; i++) {
      let data = {
        name: users[i].name,
        amount: getTotalAmount(users[i].records)
      }
      usersExpenseAmount.push(data)
    }
    const sortList = usersExpenseAmount.sort(function (a, b) {
      return a.amount > b.amount ? -1 : 1;
    })
    for (let i = 0; i < sortList.length; i++) {
      sortList[i].rating = i + 1
    }
    res.render('admin/userExpenseRating', { sortList, index })
  },
  signInPage: async (req, res) => {
    req.logout()
    return res.render('admin/signin')
  },
  login: passport.authenticate('local', {
    successRedirect: '/admin/index',
    failureRedirect: '/admin/signin',
    failureFlash: true,
  }),
  adminPage: async (req, res, next) => {
    try {
      const users = await User.find({
        isAdmin: '0'
      }).populate({
        path: 'records',
      }).lean()
      for (i=0; i < users.length; i++) {
        users[i].recordLength = users[i].records.length
      }
      const index = 'userList'
      res.render('admin/index', { users, index })
    } catch (err) {
      console.warn(err)
    }

  },
  getCatogryincomeRating: async (req, res) => {
    const index = "categoryRating"
    const [salaryData, bonusData, investmentData, othersData] = await Promise.all([Record.find({ type: "income", category: "salary" }).lean(), Record.find({ type: "income", category: "bonus" }).lean(), Record.find({ type: "income", category: "investment" }).lean(), Record.find({ type: "income", category: "others" }).lean()])
    const sortList = [{ name: "薪資所得", amount: getTotalAmount(salaryData) }, { name: "獎金紅利", amount: getTotalAmount(bonusData) }, { name: "投資報酬", amount: getTotalAmount(investmentData) }, { name: "其他", amount: getTotalAmount(othersData) }].sort(function (a, b) {
      return a.amount > b.amount ? -1 : 1;
    })
    for (let i = 0; i < sortList.length; i++) {
      sortList[i].rating = i + 1
    }
    res.render('admin/catogryincomeRating', { sortList, index })
  },
  getCatogryexpenseRating: async (req, res) => {
    const index = "categoryRating"
    const [housewaresData, transportationData, entertainmentData, consumptionData, othersData] = await Promise.all([Record.find({ type: "expense", category: "housewares" }).lean(),
    Record.find({ type: "expense", category: "transportation" }).lean(),
    Record.find({ type: "expense", category: "entertainment" }).lean(),
    Record.find({ type: "expense", category: "consumption" }).lean(),
    Record.find({ type: "expense", category: "others" }).lean()])
    const sortList = [{ name: "家居物業", amount: getTotalAmount(housewaresData) },
    { name: "交通出行", amount: getTotalAmount(transportationData) },
    { name: "休閒娛樂", amount: getTotalAmount(entertainmentData) },
    { name: "餐飲食品", amount: getTotalAmount(consumptionData) },
    { name: "其他", amount: getTotalAmount(othersData) }].sort(function (a, b) {
      return a.amount > b.amount ? -1 : 1;
    })
    for (let i = 0; i < sortList.length; i++) {
      sortList[i].rating = i + 1
    }
    res.render('admin/catogryExpenseRating', { sortList, index })
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  }
}

module.exports = adminController
