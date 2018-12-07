const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next)=>{
    //console.log(req.session['loggedIn']);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session['loggedIn'],
        loginError: req.session['loginError']
      });
}

exports.postLogin = (req, res, next)=>{      
    User.findOne(
        {
            "email" : req.body['email']            
        }
    ).then(
        (result)=>{
            if(result === null){
                // no document with specific query found
                req.session['loginError'] = true;
                res.redirect('/login');
            }
            else{
                //check hashed password
                bcrypt.compare(req.body['password'], result.password).then(
                    (ok)=>{
                        if(ok){
                            req.session['loggedIn'] = true;
                            req.session['userId'] = result._id;
                            res.redirect('/');     
                        }
                        else{
                            req.session['loginError'] = true;
                            res.redirect('/login');
                        }
                    }
                ).catch((err)=>console.log(err));                        
            }
        }
    ).catch((err)=>console.log(err));                  
}

exports.postLogout = (req, res, next)=>{
    req.session.destroy(
        ()=>{
            res.redirect('/');
        }
    )
}

exports.getSignUp = (req, res, next)=>{
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false,
        signUpError: req.session['signUpError']
    })
}
exports.postSignUp = (req, res, next)=>{
    const email = req.body['email'];
    const password = req.body['password'];

    User.findOne({
        "email" : email
    }).then(
        (result)=>{
            if(result){
                req.session['signUpError'] = true;
                return res.redirect('/signup');
            }
            bcrypt.hash(password, 12).then(
                (hashedString)=>{
                    const newUser = new User(
                        {
                            "name": email,
                            "email": email,
                            "password": hashedString,
                            "cart": {
                                items: []
                            }
                        }
                    );
                    newUser.save().then(
                        (result)=>{
                            req.session['loginError'] = false;
                            return res.redirect('/login');
                        }                
                    ).catch((err)=>console.log(err))
                }
            ).catch((err)=>console.log(err));            
        }
    ).catch((err)=>console.log(err));

}