const userController = require('../../controllers/userController')
const express = require('express')
const router = express.Router()
const passport = require('passport')
router.get('/login', userController.loginPage)
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/users/login',
  failureFlash: true
}),userController.login)
router.get('/logout',userController.logout)
router.get('/register', userController.registerPage)
router.post('/register', userController.register)


module.exports = router