const Category = require('../category')
const { categorySeeds } = require('./seed.json')
const db = require('../../config/mongoose')

db.once('open', async () => {
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