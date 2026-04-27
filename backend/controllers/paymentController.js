const Payment = require('../models/Payment');
const Order = require('../models/Order');

// @desc    Create a payment for an order
// @route   POST /api/payments
// @access  Private
const createPayment = async (req, res) => {
    const { orderId, paymentMethod, paymentResult } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // Check if order belongs to the logged in user
    if (order.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to pay for this order');
    }

    if (order.isPaid) {
        res.status(400);
        throw new Error('Order is already paid');
    }

    if (!['Card', 'Cash'].includes(paymentMethod)) {
        res.status(400);
        throw new Error('Invalid payment method. Use Card or Cash.');
    }

    const payment = new Payment({
        order: orderId,
        user: req.user._id,
        paymentMethod,
        amount: order.totalPrice,
        paymentStatus: paymentMethod === 'Cash' ? 'Pending' : 'Completed',
        paymentResult: paymentResult || {}
    });

    const createdPayment = await payment.save();

    // Mark order as paid and completed
    if (payment.paymentStatus === 'Completed') {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.status = 'Completed'; // Update order status to Completed
    } else if (paymentMethod === 'Cash') {
        // For cash on delivery, we might just leave isPaid false, but update the paymentMethod
        order.status = 'Pending';
    }
    
    order.paymentMethod = paymentMethod;
    await order.save();

    res.status(201).json(createdPayment);
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = async (req, res) => {
    const payment = await Payment.findById(req.params.id)
        .populate('order', 'totalPrice status isPaid deliveryLocation')
        .populate('user', 'name email');

    if (payment) {
        res.json(payment);
    } else {
        res.status(404);
        throw new Error('Payment not found');
    }
};

module.exports = {
    createPayment,
    getPaymentById
};
