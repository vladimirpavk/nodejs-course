const User = require('../models/user');

exports.getLogin = function(req, res, next){
    //console.log(req.session['loggedIn']);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session['loggedIn'],
        loginError: req.session['loginError']
      });
}

exports.postLogin = function(req, res, next){    
    User.findOne(
        {
            "email" : req.body['email'],
            "password" : req.body['password']
        }
    ).then(
        (result)=>{
            if(result === null){
                // no document with specific query found
                req.session['loginError'] = true;
                res.redirect('/login');
            }
            else{
                req.session['loggedIn'] = true;
                req.session['userId'] = result._id;
                res.redirect('/');          
            }
        }
    ).catch(
        (err)=>{
            console.log(err);
        }
    );          
}

exports.postLogout = function(req, res, next){
    req.session.destroy(
        ()=>{
            res.redirect('/');
        }
    )
}