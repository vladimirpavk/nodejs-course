const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');

const User = require('../models/user');

sgMail.setApiKey('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');

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
                            const msg = {
                                to: email,
                                from: 'shop@noname.com',
                                subject: 'Signup confirmation',
                                html: `<h3>You have successfully signed up to our shop.</h3>
                                        <h4>Have fun shopping</h4>`                                
                            };

                            req.session['loginError'] = false;
                            res.redirect('/login');

                            sgMail.send(msg);
                        }                
                    ).catch((err)=>console.log(err))
                }
            ).catch((err)=>console.log(err));            
        }
    ).catch((err)=>console.log(err));
}

exports.getReset = (req, res, next)=>{
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset',
        isAuthenticated: req.session['isAuthenticated'],
        resetError: req.session['resetError'],
        resetErrorMsg: req.session['resetErrorMsg'] ? req.session['resetErrorMsg'] : ''
    });
}

exports.postReset = (req, res, next)=>{
    User.findOne({
        email: req.body['email']
    }).then(
        (result)=>{            
            if(result === null){
                console.log(result);
                //user with provided email does not exist
                req.session['resetError'] = true;
                req.session['resetErrorMsg'] = "User with provided email does not exist..";
                return res.redirect('/reset');
            }
            else{
                crypto.randomBytes(32, (err, buffer)=>{
                    if(err){
                        console.log(err);
                        return;
                    }
                    console.log(buffer.toString('hex'));
                    result.resetToken = buffer.toString('hex');
                    result.resetTokenExpiration = Date.now() + 3600000; //one hour in ms
                    result.save().then(
                        (result)=>{
                            const msg = {
                                to: req.body['email'],
                                from: 'shop@noname.com',
                                subject: 'Reset password',
                                html: `<h3>Please click on the link below to reset your password. Link will expire in the next hour</h3>
                                       <a href="http://localhost:3000/reset/${buffer.toString('hex')}">http://localhost:3000/reset/${buffer.toString('hex')}</a>`                                
                            };
                            
                            res.redirect('/');

                            sgMail.send(msg);
                        }
                    ).catch((err)=>console.log(err));
                })
            }
        }
    ).catch((err)=>console.log(err));
}

exports.getResetToken = (req, res, next)=>{
    //req.params['token']
    User.findOne({
        resetToken: req.params['token']
    }).then(
        (result)=>{
            if( !result || (result.resetTokenExpiration < Date.now()) ){
                //user with specific token not found or token expired

            }
            else{
                
            }
        }
    ).catch((err)=>console.log(err));
}