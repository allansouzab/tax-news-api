const express = require('express');
const router = express.Router();
const autenticator = require('../middleware/autenticator');
const FavoritesController = require('../controllers/favorites.controller');

router.get('/', autenticator.login, FavoritesController.getFavorites);
router.post('/', autenticator.login, FavoritesController.postFavorite);
router.delete('/:id_fav', autenticator.login, FavoritesController.deleteFavorite);

module.exports = router;