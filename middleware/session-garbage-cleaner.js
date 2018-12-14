module.exports = (req, res, next)=>{
    console.log(req.url);
    console.log(req.session);

    

    next();
}