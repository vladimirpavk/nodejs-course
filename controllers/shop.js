const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {   
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session['loggedIn']
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId; 
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.session['loggedIn']
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session['loggedIn']
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.addToCart(prodId)
  .then(
    (ok)=>{
      res.redirect('/cart');
    }
  )  
  .catch(
    (err)=>{

    }
  )
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        isAuthenticated: req.session['loggedIn']
      });
    })
    .catch(err => console.log(err));
};


exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next)=>{
   Order.addOrder(req.user)
    .then(
      (ok)=>{
        console.log("ORDER SUCCESSFULLY CREATED !!!");
        res.redirect('/orders');
      }
    )
    .catch(
      (err)=>{
        console.log(err);
      }
    )
}

exports.getOrders = (req, res, next)=>{
  Order.getOrders(req.user).then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
      isAuthenticated: req.session['loggedIn']
    });
  })
  .catch(err => console.log(err))
};

exports.getInvoice = (req, res, next)=>{
  //console.log(req.params['invoiceId'], req.user);
  Order.isUserInvoice(req.user, req.params['invoiceId']).then(
    (isFound)=>{
      if(isFound){
        //console.log(__dirname+'/data/invoices/Invoice - '+req.params['invoiceId']);
        return res.download(__dirname+'/../data/invoices/Invoice - '+req.params['invoiceId']+'.pdf');
      }
      else{
        return res.redirect('/');
      }      
    }
  )
  .catch(err=>console.log(err));
}