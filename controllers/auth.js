exports.getLogin = function(req, res, next){
    //console.log(req.session['loggedIn']);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session['loggedIn']
      });
}

exports.postLogin = function(req, res, next){
    //res.cookie('loggedIn', 'true');
    req.session['loggedIn'] = true;
    res.redirect('/');
}

exports.postLogout = function(req, res, next){
    console.log('postLogout');
    req.session.destroy(
        ()=>{
            res.redirect('/');
        }
    )
}