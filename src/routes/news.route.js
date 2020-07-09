const express = require('express');
const router = express.Router();
var sql = require("mssql");

router.get('/', (req, res, next) => {
    var request = new sql.Request();
    let newsList = [];
    let news = {};
    request.query('SELECT * FROM TB_NEWS', function (err, recordSetObject) {
        if (err) { return res.status(500).send({ error: err }) }

        let result = recordSetObject.recordset;

        if (result) {
            result.forEach((value) => {
                news = {
                    id: value.NEW_ID,
                    text: value.NEW_TEXT,
                    publish: value.NEW_PUBLISH,
                    effective: value.NEW_EFFECTIVE,
                    status: value.NEW_STATUS,
                    publisher: value.NEW_PUBLISHER
                };
                newsList.push(news);
            });
        }
        return res.status(200).send(newsList);
    });
});

router.get('/:id_news', (req, res, next) => {
    const id_news = req.params.id_news;
    let news = {};
    var request = new sql.Request();
    request
    .input('id_news', sql.Int, id_news)
    .query('SELECT * FROM TB_NEWS WHERE NEW_ID = @id_news', function (err, recordSetObject) {
        if (err) { return res.status(500).send({ error: err }) }

        let result = recordSetObject.recordset[0];

        if (result) {
            news = {
                id: result.NEW_ID,
                text: result.NEW_TEXT,
                publish: result.NEW_PUBLISH,
                effective: result.NEW_EFFECTIVE,
                status: result.NEW_STATUS,
                publisher: result.NEW_PUBLISHER
            };
        }
        return res.status(200).send(news);
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