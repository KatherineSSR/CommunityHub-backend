const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/events/:id/favorite', favoriteController.addFavorite);
router.delete('/events/:id/favorite', favoriteController.removeFavorite);

// Consultar mis favoritos
router.get('/users/me/favorites', favoriteController.getMyFavorites);

module.exports = router;
