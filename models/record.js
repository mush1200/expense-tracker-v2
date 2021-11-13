const mongoose = require('mongoose')
const Schema = mongoose.Schema
const recordSchema = new Schema({
  type: { 
    type: String,
    required: true 
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  merchant: {
    type: String,
    require: true
  },
  userId: {
    type: Schema.ObjectId,
    ref: 'User',
    index: true,
    required: true,
  }
})
module.exports = mongoose.model('Record', recordSchema)