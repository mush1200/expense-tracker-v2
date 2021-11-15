const userController = require('../../controllers/userController')
const express = require('express')
const router = express.Router()



router.get('/login', userController.loginPage)
router.post('/login', userController.login)
router.get('/logout',userController.logout)
router.get('/register', userController.registerPage)
router.post('/register', userController.register)


module.exports = router