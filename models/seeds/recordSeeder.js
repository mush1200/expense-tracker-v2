const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')
const User = require('../user')
const { userSeed, recordSeeds } = require('./seed.json')
const record = require('../record')

db.once('open', async () => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(userSeed.password, salt)
    const user = await User.create({
      name: userSeed.name,
      email: userSeed.email,
      password: hash
    })
    recordSeeds.forEach((record) => {
      record.userId = user._id
    })
    await record.create(recordSeeds)
    console.log('record seeder done!')
    await db.close()
    console.log('mongodb disconnected!')
  } catch (err) {
    console.log(err)
    await db.close()
  }
})