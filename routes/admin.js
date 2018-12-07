const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/delete-product', isAuth, adminController.postDeleteProduct);
router.post('/edit-product', isAuth, adminController.postEditProduct);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
// /admin/products => GET
router.get('/products', adminController.getProducts)
// /admin/add-product => POST
router.post('/add-product', isAuth, adminController.postAddProduct);
// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

module.exports = router;
