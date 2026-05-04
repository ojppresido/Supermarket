const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Beverages', 'Snacks', 'Household', 'Other']
  },
  image: {
    type: String,
    default: 'https://picsum.photos/400/300?random=1'
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  unit: {
    type: String,
    default: 'piece',
    enum: ['piece', 'kg', 'g', 'liter', 'ml', 'pack', 'dozen']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

productSchema.index({ name: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
