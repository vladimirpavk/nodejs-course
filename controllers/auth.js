exports.getLogin = function(req, res, next){
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login'
      });
}

exports.postLogin = function(req, res, next){
    //console.log(req.body);
    //res.setHeader('Set-Cookie', 'loggedIn=true');
    res.cookie('user', 'vladimirpavk');
    res.redirect('/');
}