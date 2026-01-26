const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: String
});

module.exports = mongoose.model('Medicine', medicineSchema);
