const router = require('express').Router();

const userController = require('../controllers/user');
const fileUpload = require('../services/fileUpload');
const isAuth = require('../../middlewares/isAuth');

// ====================== Onboarding ======================= //
router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/verifyOtp', userController.verifyOtp);
router.post('/resetPassword', userController.resetPassword);

// ============ Products ============ //
router.post('/products', fileUpload.userProfilePic.single('image'), userController.addProduct);
router.get('/products', userController.getAllProducts);
router.get('/products/:id', userController.getProduct);
router.delete('/products/:id', userController.deleteProduct);

router.post('/cart/:id', isAuth.isUserValid, userController.addToCart);
router.delete('/cart/:id', isAuth.isUserValid, userController.removeFromCart);

module.exports = router;
