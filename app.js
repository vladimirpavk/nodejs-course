const express=require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const eApp = express();

eApp.use(bodyParser.urlencoded({ extended: true }));

eApp.use('/admin', adminRoutes);
eApp.use(shopRoutes);

eApp.use((req, res, next)=>{
    res.status(404).send('<h1>Page not found</h1>');
})

eApp.listen(3000);