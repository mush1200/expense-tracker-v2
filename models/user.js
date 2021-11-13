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
  }
})
module.exports = mongoose.model('User', userSchema)