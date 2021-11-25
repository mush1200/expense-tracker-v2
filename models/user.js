const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  facebookId: { 
    type: String 
  },
  googleId: { 
    type: String 
  },
  githubId: { 
    type: String 
  },
  isAdmin: {
    type: String,
    default: 0,
    required: true,
  }, 
  records: [{
    type: Schema.Types.ObjectId,
    ref: 'Record',
  }]
})
module.exports = mongoose.model('User', userSchema)