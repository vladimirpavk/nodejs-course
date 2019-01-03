const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');
const sessionGarbageCleaner = require('../middleware/session-garbage-cleaner');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', sessionGarbageCleaner, shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);
router.post('/cart', isAuth, shopController.postCart);
router.get('/cart', isAuth, shopController.getCart);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);
router.post('/create-order', isAuth, shopController.postOrder);
router.get('/orders', isAuth, shopController.getOrders);
router.get('/orders/:invoiceId', isAuth, shopController.getInvoice);

module.exports = router;
