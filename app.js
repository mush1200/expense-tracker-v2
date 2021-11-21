const express = require('express')
const session = require('express-session')
const usePassport = require('./config/passport')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const app = express()
const methodOverride = require('method-override') 
const routes = require('./routes')
const chart = require('chart.js')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
require('./config/mongoose')
const port = process.env.port


app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.engine('handlebars', 
  exphbs({ 
    defaultLayout: 'main',
    helpers: require('./config/handlebars-helpers')
  })
)
app.set('view engine', 'handlebars')

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_messages = req.flash('success_messages')  // 設定 success_msg 訊息
  res.locals.error_messages = req.flash('error_messages')  // 設定 warning_msg 訊息
  next()
})
app.use(methodOverride('_method'))
app.use(routes)

app.listen(port, () => {
  console.log(`The Express server is running on http://localhost:${port}.`)
})
