const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../models/user.js')
const Record = require('../models/record')
const Category = require('../models/category')
const { getIconName, getTotalAmount } = require('../public/javascripts/helper')
const adminController = {
  getUserIncomeRating: async (req, res, next) => {
    const records = await Record.find({
      type: 'income'
    }).populate('userId').lean().sort({ date: 'desc' })
    const a = records.map((record) => {
      console.log(record.userId)
    })
    res.render('admin/userIncomeRating')
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
  adminPage: (req, res) => {
    User.find()
      .lean()
      .then()
      .then(users => {
        res.render('admin/index', { users })
      })
      .catch(err => console.log(err))
  },
  getCatogryincomeRating: async (req, res) => {
    const [salaryData, bonusData, transportationData, othersData] = await Promise.all([Record.find({ type: "income", category: "salary" }).lean(), Record.find({ type: "income", category: "bonus" }).lean(), Record.find({ type: "income", category: "transportation" }).lean(), Record.find({ type: "income", category: "others" }).lean()])
    const sortList = [{ name: "salary", amount: getTotalAmount(salaryData) }, { name: "bonus", amount: getTotalAmount(bonusData) }, { name: "transportation", amount: getTotalAmount(transportationData) }, { name: "others", amount: getTotalAmount(othersData) }].sort(function (a, b) {
      return a.amount > b.amount ? -1 : 1;
    })
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
  getUserIncomeRating: async(req, res, next) => {
    const records = await Record.find({
      type: 'income'
    }).populate({
      path: 'userId',
      match: { isAdmin: { $ne: "0" } },
    }).lean().sort({date: 'desc'})
    let array = []
    const a = records.map((record) => {
      array.push(record)
    })
    console.log(array)
    res.render('admin/userIncomeRating')
  }
}

module.exports = adminController
