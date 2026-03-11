const express = require('express');
const router = express.Router();
const { placeOrder, getOrders, getOrderById } = require('../controllers/orderController');
const optionalAuth = require('../middleware/optionalAuth');

router.use(optionalAuth);

router.post('/', placeOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);

module.exports = router;
