const express = require('express');
const router = express.Router();
var sql = require("mssql");

router.get('/', (req, res, next) => {
    var request = new sql.Request();
    request.query('SELECT * FROM TB_NEWS', function (err, recordSetObject) {
        if (err) console.log(err)
        res.status(200).send(recordSetObject.recordset[0]);
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
    const news = {
        id_news: req.body.id_news,
        text: req.body.text,
        publish_date: req.body.publish_date,
        effective_date: req.body.effective_date
    }

    res.status(201).send({
        mensagem: 'Insere uma nova noticia',
        inserted_news: news
    });
});

module.exports = router;