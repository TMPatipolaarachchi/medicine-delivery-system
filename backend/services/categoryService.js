const Category = require('../models/Category');

const createCategory = async (data) => {
    const { name, description, image } = data;
    if (!name) {
        throw new Error('Category name is required');
    }
    
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
        throw new Error('Category already exists');
    }

    const category = new Category({ name, description, image });
    return await category.save();
};

const getAllCategories = async () => {
    return await Category.find({});
};

const updateCategory = async (id, data) => {
    const category = await Category.findById(id);
    if (!category) {
        throw new Error('Category not found');
    }

    if (data.name) category.name = data.name;
    if (data.description !== undefined) category.description = data.description;
    if (data.image !== undefined) category.image = data.image;

    return await category.save();
};

const deleteCategory = async (id) => {
    const category = await Category.findById(id);
    if (!category) {
        throw new Error('Category not found');
    }

    await category.deleteOne();
    return { message: 'Category removed' };
};

module.exports = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
};
