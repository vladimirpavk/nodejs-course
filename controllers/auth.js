exports.getLogin = function(req, res, next){
    console.log(req.cookies['user']);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login'
      });
}

exports.postLogin = function(req, res, next){
    res.cookie('loggedIn', 'true');
    res.redirect('/');
}