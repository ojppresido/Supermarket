const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin, manager } = require('../middleware/authMiddleware');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    
    const keyword = req.query.keyword ? {
      $or: [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } }
      ]
    } : {};

    const count = await Product.countDocuments({ ...keyword, isActive: true });
    const products = await Product.find({ ...keyword, isActive: true })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Admin/Manager
router.post('/', protect, manager, async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.body.image,
      stock: req.body.stock,
      unit: req.body.unit
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin/Manager
router.put('/:id', protect, manager, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.category = req.body.category || product.category;
      product.image = req.body.image || product.image;
      product.stock = req.body.stock || product.stock;
      product.unit = req.body.unit || product.unit;
      product.isActive = req.body.isActive !== undefined ? req.body.isActive : product.isActive;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/products/categories/all
// @desc    Get all categories
// @access  Public
router.get('/categories/all', async (req, res) => {
  try {
    const categories = ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Beverages', 'Snacks', 'Household', 'Other'];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
