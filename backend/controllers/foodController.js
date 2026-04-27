const foodService = require('../services/foodService');

// @desc    Get all medicine items
// @route   GET /api/medicines
// @access  Public
const getFoods = async (req, res) => {
    const foods = await foodService.getAllFoods();
    res.json(foods);
};

// @desc    Get medicines by category
// @route   GET /api/medicines/category/:categoryId
// @access  Public
const getFoodsByCategory = async (req, res) => {
    const foods = await foodService.getFoodsByCategory(req.params.categoryId);
    res.json(foods);
};

// @desc    Create a medicine item
// @route   POST /api/medicines
// @access  Private/Admin
const createFood = async (req, res) => {
    try {
        const food = await foodService.createFood(req.body);
        res.status(201).json(food);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

// @desc    Update a medicine item
// @route   PUT /api/medicines/:id
// @access  Private/Admin
const updateFood = async (req, res) => {
    try {
        const food = await foodService.updateFood(req.params.id, req.body);
        res.json(food);
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
};

// @desc    Delete a medicine item
// @route   DELETE /api/medicines/:id
// @access  Private/Admin
const deleteFood = async (req, res) => {
    try {
        const result = await foodService.deleteFood(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
};

module.exports = {
    getFoods,
    getFoodsByCategory,
    createFood,
    updateFood,
    deleteFood,
};
