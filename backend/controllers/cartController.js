const Cart = require('../models/Cart');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.food');
    
    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [], totalPrice: 0 });
    }
    
    res.json(cart);
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
    const { foodId, medicineId, quantity, price } = req.body;
    const itemId = medicineId || foodId;

    if (!itemId) {
        res.status(400);
        throw new Error('medicineId (or foodId) is required');
    }
    
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
        cart = new Cart({ user: req.user._id, items: [], totalPrice: 0 });
    }
    
    const existingItemIndex = cart.items.findIndex(item => item.food.toString() === itemId);
    
    if (existingItemIndex >= 0) {
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        cart.items.push({ food: itemId, quantity, price });
    }
    
    // Recalculate total price
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    await cart.save();
    res.json(cart);
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = async (req, res) => {
    const { quantity } = req.body;
    const itemId = req.params.itemId || req.params.medicineId || req.params.foodId;
    
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }
    
    const itemIndex = cart.items.findIndex(item => item.food.toString() === itemId);
    
    if (itemIndex >= 0) {
        cart.items[itemIndex].quantity = quantity;
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        await cart.save();
        res.json(cart);
    } else {
        res.status(404);
        throw new Error('Item not found in cart');
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeFromCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    const itemId = req.params.itemId || req.params.medicineId || req.params.foodId;
    
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }
    
    cart.items = cart.items.filter(item => item.food.toString() !== itemId);
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    await cart.save();
    res.json(cart);
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
};
