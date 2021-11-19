const mongoose = require('mongoose')
const MONGODB_URI = process.env.MONGODB_URI
mongoose.connect("mongodb://localhost/expense-tracker-v2", { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

//連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
//連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

module.exports = db