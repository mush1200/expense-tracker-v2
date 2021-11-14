const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose') // 載入 mongoose
const app = express()
const routes = require('./routes')

require('./config/mongoose')
const port = 3000


app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(routes)
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')



app.listen(port, () => {
  console.log(`The Express server is running on http://localhost:${port}.`)
})
