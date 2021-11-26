const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../models/user.js')
const Record = require('../models/record')
const Category = require('../models/category')
const { getIconName, getTotalAmount } = require('../public/javascripts/helper')
const adminController = {
  getShowPage: async (req, res, next) => {
    try {
      const userId = req.params._id
      const user = await User.findOne({ userId }).populate({
        path: 'records',
      }).lean()
      user.recordLength = user.records.length
      user.TotalAmount = getTotalAmount(user.records)
      res.render('admin/show', { user })
    } catch (err) {
      console.warn(err)
    }
  },
  getUserIncomeRating: async (req, res, next) => {
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
    res.render('admin/userIncomeRating', { sortList })
  },
  getUserExpenseRating: async (req, res, next) => {
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
    res.render('admin/userExpenseRating', { sortList })
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
      res.render('admin/index', { users })
    } catch (err) {
      console.warn(err)
    }

  },
  getCatogryincomeRating: async (req, res) => {
    const [salaryData, bonusData, transportationData, othersData] = await Promise.all([Record.find({ type: "income", category: "salary" }).lean(), Record.find({ type: "income", category: "bonus" }).lean(), Record.find({ type: "income", category: "transportation" }).lean(), Record.find({ type: "income", category: "others" }).lean()])
    const sortList = [{ name: "salary", amount: getTotalAmount(salaryData) }, { name: "bonus", amount: getTotalAmount(bonusData) }, { name: "transportation", amount: getTotalAmount(transportationData) }, { name: "others", amount: getTotalAmount(othersData) }].sort()
    for (let i = 0; i < sortList.length; i++) {
      sortList[i].rating = i + 1
    }
    res.render('admin/catogryincomeRating', { sortList })
  },
  getCatogryexpenseRating: async (req, res) => {
    const [housewaresData, transportationData, entertainmentData, consumptionData, othersData] = await Promise.all([Record.find({ type: "expense", category: "housewares" }).lean(),
    Record.find({ type: "expense", category: "transportation" }).lean(),
    Record.find({ type: "expense", category: "entertainment" }).lean(),
    Record.find({ type: "expense", category: "consumption" }).lean(),
    Record.find({ type: "expense", category: "others" }).lean()])
    const sortList = [{ name: "housewares", amount: getTotalAmount(housewaresData) },
    { name: "transportation", amount: getTotalAmount(transportationData) },
    { name: "entertainment", amount: getTotalAmount(entertainmentData) },
    { name: "consumption", amount: getTotalAmount(consumptionData) },
    { name: "others", amount: getTotalAmount(othersData) }].sort(function (a, b) {
      return a.amount > b.amount ? -1 : 1;
    })
    for (let i = 0; i < sortList.length; i++) {
      sortList[i].rating = i + 1
    }
    res.render('admin/catogryExpenseRating', { sortList })
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },
}

module.exports = adminController
