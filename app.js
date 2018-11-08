const express=require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const eApp = express();

eApp.use(bodyParser.urlencoded({ extended: true }));
eApp.use(express.static(path.join(__dirname, 'public')));

eApp.use((req, res, next)=>{
    console.log(req.url);
    next();
})

eApp.use('/admin', adminRoutes);
eApp.use(shopRoutes);

eApp.use((req, res, next)=>{
    /*res.writeHead(200, 
        {
            'Content-Type': 'text/html'
        });
    res.statusCode =  404;
    fs.createReadStream('./views/404.html').pipe(res);*/
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));    
})

eApp.listen(3000);