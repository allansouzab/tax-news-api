const express = require('express');
const router = express.Router();
const mssql = require("../mssql");
const sql = require("mssql");

router.get('/', async (req, res, next) => {
    try {
        let conn = await mssql.getConnection();

        if (!conn._connected)
            return res.status(500).send({ error: 'Database connection not provided.' })

        let newsList = [];
        let news = {};

        let query = await new sql.Request().query('SELECT * FROM TB_NEWS WHERE NEW_STATUS = 1');
        let result = query.recordset;

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

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
});

router.get('/:id_news', async (req, res, next) => {
    try {
        let conn = await mssql.getConnection();

        if (!conn._connected)
            return res.status(500).send({ error: 'Database connection not provided.' })

        const id_news = req.params.id_news;
        let news = {};

        let query = await new sql.Request()
            .input('id_news', sql.Int, id_news)
            .query('SELECT * FROM TB_NEWS WHERE NEW_ID = @id_news AND NEW_STATUS = 1');
        let result = query.recordset[0];

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

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
});

router.post('/', async (req, res, next) => {
    try {
        let conn = await mssql.getConnection();

        if (!conn._connected)
            return res.status(500).send({ error: 'Database connection not provided.' })

        let query = await new sql.Request()
            .input('title', req.body.title)
            .input('uf', req.body.uf)
            .input('text', req.body.text)
            .input('publish', req.body.publish_date)
            .input('effective', req.body.effective_date)
            .input('status', 1)
            .input('publisher', req.body.publisher)
            .query('INSERT INTO TB_NEWS (NEW_TITLE, NEW_UF, NEW_TEXT, NEW_PUBLISH, NEW_EFFECTIVE, NEW_STATUS, NEW_PUBLISHER) VALUES (@title, @uf, @text, @publish, @effective, @status, @publisher)');

        if (query.rowsAffected > 0) {
            return res.status(201).send({
                message: 'Notícia cadastrada com sucesso!',
                inserted_news: req.body
            });
        }

        return res.status(400).send({
            message: 'Não foi possível cadastrar uma notícia.',
            inserted_news: req.body
        });

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
});

router.put('/', async (req, res, next) => {
    try {
        let conn = await mssql.getConnection();

        if (!conn._connected)
            return res.status(500).send({ error: 'Database connection not provided.' })

        let query = await new sql.Request()
            .input('id', req.body.id)
            .input('title', req.body.title)
            .input('uf', req.body.uf)
            .input('text', req.body.text)
            .input('publish', req.body.publish_date)
            .input('effective', req.body.effective_date)
            .input('status', req.body.status)
            .input('publisher', req.body.publisher)
            .query('UPDATE TB_NEWS SET NEW_TITLE = @title, NEW_UF = @uf, NEW_TEXT = @text, NEW_PUBLISH = @publish, NEW_EFFECTIVE = @effective, NEW_STATUS = @status, NEW_PUBLISHER = @publisher WHERE NEW_ID = @id');

        if (query.rowsAffected > 0) {
            return res.status(201).send({
                message: 'Notícia atualizada com sucesso!',
                updated_news: req.body
            });
        }

        return res.status(400).send({
            message: 'Não foi possível atualizar uma notícia.',
            updated_news: req.body
        });

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
});

router.delete('/:id_news', async (req, res, next) => {
    try {
        let conn = await mssql.getConnection();

        if (!conn._connected)
            return res.status(500).send({ error: 'Database connection not provided.' })

        const id_news = req.params.id_news;

        let query = await new sql.Request()
            .input('id', id_news)
            .input('status', 2)
            .query('UPDATE TB_NEWS SET NEW_STATUS = @status WHERE NEW_ID = @id');

        if (query.rowsAffected > 0) {
            return res.status(201).send({
                message: 'Notícia deletada com sucesso!',
                deleted_new_id: id_news
            });
        }

        return res.status(400).send({
            message: 'Não foi possível deletar uma notícia.',
            deleted_new_id: id_news
        });

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
});

module.exports = router;