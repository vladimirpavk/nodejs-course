const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.post('/delete-product', adminController.postDeleteProduct);
router.post('/edit-product', adminController.postEditProduct);
router.get('/edit-product/:productId', adminController.getEditProduct);
// /admin/products => GET
router.get('/products', adminController.getProducts)
// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);
// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

module.exports = router;
