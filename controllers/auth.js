const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const expValidator = require('express-validator/check');

const User = require('../models/user');
const config = require('../app-config');

sgMail.setApiKey(config.sendGridApi);

exports.getLogin = (req, res, next)=>{
    if(req.session.sites){
        if(!req.session.sites.login){
            req.session.sites = {
                login: {
                    error: false
                }
            }
        }
    }
    else{
        req.session.sites = {
            login: {
                error: false
            }
        }
    }

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session['loggedIn'],
        error: req.session.sites.login.error,
        errorMsg: req.session.sites.login.errorMsg
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
                req.session.sites = {
                    login : {
                        error : true,
                        errorMsg : 'User with specified email was not found'
                    }
                };                
                res.redirect('/login');
            }
            else{
                //check hashed password
                bcrypt.compare(req.body['password'], result.password).then(
                    (ok)=>{
                        if(ok){
                            req.session['loggedIn'] = true;
                            req.session['userId'] = result._id;
                            req.session.sites = {
                                login : {
                                    error : false,
                                    //errorMsg može ali ne mora da se briše jer se i onako ne prikazuje
                                    errorMsg : ''
                                }                               
                            }
                            
                            res.redirect('/');     
                        }
                        else{                                                                                                                                             
                            req.session.sites = {
                                login: {
                                    error : true,
                                    errorMsg : 'Please provide valid password'
                                }                                
                            };        
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
        signUpError: req.session['signUpError'],
        signUpMsg: req.session['signUpMsg']
    })
}

exports.postSignUp = (req, res, next)=>{
    const email = req.body['email'];
    const password = req.body['password'];
    
    let errorMsg = '';
    const errors = expValidator.validationResult(req);
    if(!errors.isEmpty()){
        //console.log(errors.array());
        errors.array().forEach(
            (arrElement)=>{
                if(arrElement.param==='email'){
                    errorMsg = 'email - '+arrElement.msg;
                }
            }
        )
        req.session['signUpError'] = true;
        req.session['signUpMsg'] = errorMsg;
        return res.redirect('/signup');
    }
   
    User.findOne({
        "email" : email
    }).then(
        (result)=>{
            if(result){
                req.session['signUpError'] = true;
                req.session['signUpMsg'] = "User already exists...";
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
        resetErrorMsg: req.session['resetError'] ? req.session['resetErrorMsg'] : ''
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
                req.session['resetError'] = false;

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
                console.log(!result);
                console.log(result.resetTokenExpiration < Date.now());
                //user with specific token not found or token expired
                req.session['resetError'] = true;
                req.session['resetErrorMsg'] = 'User with specific token not found or token expired';
                res.redirect('/reset');
            }
            else{
                res.render('auth/reset-password', {
                    path: '/reset-password',
                    pageTitle: 'Reset password',
                    isAuthenticated: req.session['isAuthenticated'],
                    resetToken: req.params['token'],
                    resetError: req.session['resetError'],
                    resetErrorMsg: req.session['resetError'] ? req.session['resetErrorMsg'] : ''
                });
            }
        }
    ).catch((err)=>console.log(err));
}

exports.postResetPassword = (req, res, next)=>{
//req.body['token']
//req.body['password']
    User.findOne(
        {
            resetToken: req.body['token']
        }
    ).then(
        (result)=>{           
            bcrypt.hash(req.body['password'], 12).then(
                (hashedPassword)=>{
                    result.password = hashedPassword.toString('hex');
                    result.save();
                    res.redirect('/login');
                }
            ).catch(err=>console.log(err));                       
        }
    ).catch(err=>console.log(err));
}