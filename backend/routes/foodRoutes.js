const express = require('express');
const router = express.Router();
const { getFoods, createFood, updateFood, deleteFood, getFoodsByCategory } = require('../controllers/foodController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getFoods)
    .post(protect, admin, createFood);

router.route('/category/:categoryId')
    .get(getFoodsByCategory);

router.route('/:id')
    .put(protect, admin, updateFood)
    .delete(protect, admin, deleteFood);

module.exports = router;
