const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Retorna todas as noticias'
    });
});

router.get('/:id_news', (req, res, next) => {
    const id_news = req.params.id_news;
    res.status(200).send({
        id: id_news,
        mensagem: 'Retorna uma unica noticia'
    });
});

router.post('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Insere uma nova noticia'
    });
});

module.exports = router;