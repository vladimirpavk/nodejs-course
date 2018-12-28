const router = require('express').Router();
const expValidator = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');

router.get('/login', authController.getLogin);
router.post('/login', 
[
    expValidator.body('email')
        .isEmail()
        .withMessage('Not valid email...')
        .custom((value, { req })=>{
            return User.findOne(
                {
                    "email" : value            
                }
            ).then(
                (result)=>{
                    if(!result){
                        //User does not exists
                       return Promise.reject('User does not exsists');
                    }                    
                    req.passFromCollection = result.password;
                    req.pass_id = result._id;
                }
        ).catch((err)=>console.log(err));
        }),
    expValidator.body('password')
        .isLength({ min: 5 })
        .withMessage('Password must be minimum 5 characters long')
],  
    authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignUp);
router.post('/signup', expValidator.check('email').isEmail() ,authController.postSignUp);

router.get('/reset', authController.getReset);
router.get('/reset/:token', authController.getResetToken);
router.post('/reset', authController.postReset);
router.post('/reset-password', authController.postResetPassword);

module.exports = router;