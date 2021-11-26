const express = require('express')
const router = express.Router()
const users = require('./modules/users')
const home = require('./modules/home')
const admin = require('./modules/admin')
const auth = require('./modules/auth') 
const { authenticator, authenticatedAdmin } = require('../middleware/auth')


router.use('/admin', admin)
router.use('/users', users)
router.use('/auth', auth)
router.use('/', home)



module.exports = router