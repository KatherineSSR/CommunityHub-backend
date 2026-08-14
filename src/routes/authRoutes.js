const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');


// post /api/auth/register 
router.post('/register', upload.single('profileImage'), authController.register);

//post /api/auth/login 
router.post('/login', authController.login);

//get /api/auth/me 
router.get('/me', authMiddleware, authController.myProfile);

//post /api/auth/logout
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;