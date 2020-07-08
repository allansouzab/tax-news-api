const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Usando GET da rota News'
    });
});

router.get('/:id_news', (req, res, next) => {
    const id_news = req.params.id_news;
    res.status(200).send({
        id: id_news,
        mensagem: 'Usando GET da rota News'
    });
});

router.post('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usando POST da rota News'
    });
});

module.exports = router;