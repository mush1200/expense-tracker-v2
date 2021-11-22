const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../models/user.js')
 
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
}
 
module.exports = adminController
