const mongoose = require('mongoose')
const Category = require('../category')
const { categorySeeds } = require('./seed.json')
mongoose.connect('mongodb://localhost/expense-tracker-v2', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', async () => {
  console.log('mongodb connected!')
  try {
    await Category.create(categorySeeds)
    console.log('category seeder done!')
    await db.close()
    console.log('mongodb disconnected!')
  } catch (err) {
    console.log(err)
    await db.close()
  }
})