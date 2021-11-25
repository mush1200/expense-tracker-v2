const bcrypt = require('bcryptjs/dist/bcrypt')
const db = require('../../config/mongoose')
const Record = require('../record')
const User = require('../user')
const { userSeed, recordSeeds } = require('./seed.json')
 
db.once('open', async () => {
  try {
    const salt = await bcrypt.genSalt(10)
    const userhash = await bcrypt.hash(userSeed.password, salt)
    const user = await User.create({
      name: userSeed.name,
      email: userSeed.email,
      password: userhash
    })
    recordSeeds.forEach((record) => {
      record.userId = user._id
    })
    await Record.create(recordSeeds).then(records => {
      records.forEach(record => {
        user.records.push(record._id)
      })
      user.save()
    })
//root
    const roothash = await bcrypt.hash('12345678', salt)
    const root = await User.create({
      name: 'root',
      email: 'root@example.com',
      password: roothash,
      isAdmin: '1'
    })
    console.log('record seeder done!')
    await db.close()
    console.log('mongodb disconnected!')
  } catch (err) {
    console.log(err)
    await db.close()
  }
})
