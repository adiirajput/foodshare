const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  foodId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  recipientName: { type: String, required: true },
  recipientPhone:{ type: String, default: '' },
  status:        { type: String, enum: ['pending','completed','cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Claim', claimSchema);
