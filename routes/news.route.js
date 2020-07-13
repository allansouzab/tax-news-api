const express = require('express');
const router = express.Router();
const autenticator = require('../middleware/autenticator');
const NewsController = require('../controllers/news.controller');

router.get('/', NewsController.getNews);
router.get('/:id_news', NewsController.getSingleNew);
router.post('/', autenticator.administrator, NewsController.postNew);
router.put('/', autenticator.administrator, NewsController.updateNew);
router.delete('/:id_news', autenticator.administrator, NewsController.deleteNew);

module.exports = router;