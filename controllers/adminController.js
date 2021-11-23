const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../models/user.js')
const Record = require('../models/record')

const adminController = {
  signInPage: (req, res) => {
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
      res.render('admin/index', { users })})
    .catch(err => console.log(err))
 
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
