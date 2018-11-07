const fs = require('fs');
const express = require('express');

const router = express.Router();

router.get('/add-user', (req, res, next)=>{    
    res.writeHead(200, 
        {
            'Content-Type': 'text/html'
        });
    fs.createReadStream('./site1.html').pipe(res);   
});

router.post('/add-user', (req, res, next)=>{
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;