const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middlewares/authMiddleware');

const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

const userRoles = roleMiddleware('user');

router.post('/events/:id/favorite', userRoles, favoriteController.addFavorite);
router.delete('/events/:id/favorite', userRoles, favoriteController.removeFavorite);

// Consultar mis favoritos
router.get('/users/me/favorites', userRoles, favoriteController.getMyFavorites);

module.exports = router;
