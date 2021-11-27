const bcrypt = require('bcryptjs')
const User = require('../models/user')


const userController = {
  loginPage: (req, res) => {
    req.flash('error_messages', '請填寫登入資料。')
    return res.render('login')
  },
  login: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/')
  },
  logout: (req, res) => {
    req.logout()
    req.flash('success_messages', '你已經成功登出。')
    res.redirect('/users/login')
  },
  registerPage: (req, res) => {
    req.flash('error_messages', '請填寫註冊資訊。')
    return res.render('register')
  },
  register: async(req, res, next) => {
    try {
      const { name, email, password, confirmPassword } = req.body
      const errors = []
      if (name.length > 32) {
        errors.push({ message: '名稱不可大於32字元!' })
      }
      // 正規表達式檢查密碼
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/
      if (!regex.test(password)) {
        errors.push({ message: '密碼至少8碼，至少1個大寫字母，1個小寫字母和1個數字！' })
      }
      if (password !== confirmPassword) {
        errors.push({ message: '密碼與確認密碼不相符！' })
      }
      if (errors.length) {
        return res.render('register', { errors, name, email, password, confirmPassword })
      }
      const user = await User.findOne({ email })
      if (user) {
        errors.push({ message: '這個 Email 已經註冊過了。' })
        return res.render('register', { errors, name, email, password, confirmPassword })
      } else {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        await User.create({ name, email, password: hash })
        req.flash('success_messages', '你已經成功註冊!')
        return res.redirect('/users/login')
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}
module.exports = userController