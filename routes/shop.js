const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/', (req, res, next)=>{    
    res.status(200).sendFile(path.join(__dirname, '../', 'views', 'shop.html'));    
    //fs.createReadStream('./views/shop.html').pipe(res);
});

module.exports = router;