module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin !== '1') { return next() }
      req.flash('error_messages', '此帳號為管理者帳號，不可登入前台！')
      return res.redirect('/admin/signin')
    }
    req.flash('error_messages', '請先登入才能使用!')
    res.redirect('/users/login')
  },
    authenticatedAdmin: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin === '1') { return next() }
      req.flash('error_messages', '此帳號非管理者帳號！')
      return res.redirect('/admin/signin')
    }
    res.redirect('/admin/signin')
  }
}