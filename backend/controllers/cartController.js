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
    const { foodId, quantity, price } = req.body;
    
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
        cart = new Cart({ user: req.user._id, items: [], totalPrice: 0 });
    }
    
    const existingItemIndex = cart.items.findIndex(item => item.food.toString() === foodId);
    
    if (existingItemIndex >= 0) {
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        cart.items.push({ food: foodId, quantity, price });
    }
    
    // Recalculate total price
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    await cart.save();
    res.json(cart);
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:foodId
// @access  Private
const updateCartItem = async (req, res) => {
    const { quantity } = req.body;
    
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }
    
    const itemIndex = cart.items.findIndex(item => item.food.toString() === req.params.foodId);
    
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
// @route   DELETE /api/cart/:foodId
// @access  Private
const removeFromCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }
    
    cart.items = cart.items.filter(item => item.food.toString() !== req.params.foodId);
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
