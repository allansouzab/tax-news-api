const express = require('express');
const router = express.Router();
const mssql = require("../mssql");
const sql = require("mssql");

router.get('/', async (req, res, next) => {
    try {
        let conn = await mssql.getConnection();

        if (!conn._connected)
            return res.status(500).send({ error: 'Database connection not provided.' })

        let request = new sql.Request();
        let newsList = [];
        let news = {};

        request
            .query('SELECT * FROM TB_NEWS', function (err, recordSetObject) {
                if (err) { return res.status(500).send({ error: err }) }

                let result = recordSetObject.recordset;

                if (result) {
                    result.forEach((value) => {
                        news = {
                            id: value.NEW_ID,
                            title: value.NEW_TITLE,
                            uf: value.NEW_UF,
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
    } catch (error) {
        res.status(500).send({ error: error })
    }
});

router.get('/:id_news', async (req, res, next) => {
    try {
        let conn = await mssql.getConnection();

        if (!conn._connected)
            return res.status(500).send({ error: 'Database connection not provided.' })

        const id_news = req.params.id_news;
        let news = {};
        let request = new sql.Request();

        request
            .input('id_news', sql.Int, id_news)
            .query('SELECT * FROM TB_NEWS WHERE NEW_ID = @id_news', function (err, recordSetObject) {
                if (err) { return res.status(500).send({ error: err }) }

                let result = recordSetObject.recordset[0];

                if (result) {
                    news = {
                        id: result.NEW_ID,
                        title: result.NEW_TITLE,
                        uf: result.NEW_UF,
                        text: result.NEW_TEXT,
                        publish: result.NEW_PUBLISH,
                        effective: result.NEW_EFFECTIVE,
                        status: result.NEW_STATUS,
                        publisher: result.NEW_PUBLISHER
                    };
                }
                return res.status(200).send(news);
            });
    } catch (error) {
        res.status(500).send({ error: error })
    }
});

router.post('/', async (req, res, next) => {
    try {
        let conn = await mssql.getConnection();

        if (!conn._connected)
            return res.status(500).send({ error: 'Database connection not provided.' })

        let request = new sql.Request();

        request
            .input('title', req.body.title)
            .input('uf', req.body.uf)
            .input('text', req.body.text)
            .input('publish', req.body.publish_date)
            .input('effective', req.body.effective_date)
            .input('status', req.body.status)
            .input('publisher', req.body.publisher)
            .query('INSERT INTO TB_NEWS (NEW_TITLE, NEW_UF, NEW_TEXT, NEW_PUBLISH, NEW_EFFECTIVE, NEW_STATUS, NEW_PUBLISHER) VALUES (@title, @uf, @text, @publish, @effective, @status, @publisher)', function (err, recordSetObject) {
                if (err) { return res.status(500).send({ error: err }) }

                if (recordSetObject.rowsAffected > 0) {
                    return res.status(201).send({
                        mensagem: 'Notícia cadastrada com sucesso!',
                        inserted_news: req.body
                    });
                }
            });
    } catch (error) {
        res.status(500).send({ error: error })
    }
});

module.exports = router;