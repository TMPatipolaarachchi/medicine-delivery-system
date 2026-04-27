const Food = require('../models/Food');

const createFood = async (data) => {
    const { name, description, price, category, image } = data;
    
    if (!name || !description || !price || !category) {
        throw new Error('Name, description, price, and category are required');
    }

    const food = new Food({
        name,
        description,
        price,
        category,
        image
    });

    return await food.save();
};

const getAllFoods = async () => {
    return await Food.find({}).populate('category', 'name');
};

const getFoodsByCategory = async (categoryId) => {
    return await Food.find({ category: categoryId }).populate('category', 'name');
};

const updateFood = async (id, data) => {
    const food = await Food.findById(id);
    if (!food) {
        throw new Error('Food not found');
    }

    if (data.name) food.name = data.name;
    if (data.description) food.description = data.description;
    if (data.price !== undefined) food.price = data.price;
    if (data.category) food.category = data.category;
    if (data.image) food.image = data.image;
    if (data.isAvailable !== undefined) food.isAvailable = data.isAvailable;

    return await food.save();
};

const deleteFood = async (id) => {
    const food = await Food.findById(id);
    if (!food) {
        throw new Error('Food not found');
    }

    await food.deleteOne();
    return { message: 'Food item removed' };
};

module.exports = {
    createFood,
    getAllFoods,
    getFoodsByCategory,
    updateFood,
    deleteFood
};
