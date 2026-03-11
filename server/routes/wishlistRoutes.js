const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist, getWishlistIds } = require('../controllers/wishlistController');
const optionalAuth = require('../middleware/optionalAuth');

router.use(optionalAuth);

router.get('/', getWishlist);
router.get('/ids', getWishlistIds);
router.post('/', addToWishlist);
router.delete('/:productId', removeFromWishlist);

module.exports = router;
