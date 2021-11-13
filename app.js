const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose') // 載入 mongoose
const app = express()
mongoose.connect('mongodb://localhost/expense-tracker-v2', { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB
const port = 3000
// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  const options = req.body
  const password = generatePassword(options)
  res.render('index', {password: password, options: options})
})
app.listen(port, () => {
  console.log(`The Express server is running on http://localhost:${port}.`)
})
