const router = require('express').Router();
const expValidator = require('express-validator/check');

const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignUp);
router.post('/signup', expValidator.check('email').isEmail() ,authController.postSignUp);

router.get('/reset', authController.getReset);
router.get('/reset/:token', authController.getResetToken);
router.post('/reset', authController.postReset);
router.post('/reset-password', authController.postResetPassword);

module.exports = router;