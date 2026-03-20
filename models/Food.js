const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  quantity:    { type: String, required: true },
  category:    { type: String, enum: ['cooked','raw','packaged','bakery','fruits','dairy','other'], default: 'other' },
  expiry:      { type: Date, required: true },
  location:    { type: String, required: true },
  description: { type: String, default: '' },
  donorName:   { type: String, required: true },
  donorPhone:  { type: String, default: '' },
  status:      { type: String, enum: ['available','claimed','completed','expired'], default: 'available' }
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);
