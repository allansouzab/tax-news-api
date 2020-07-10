const express = require('express');
const router = express.Router();
const mssql = require("../mssql");
const sql = require("mssql");

router.get('/', async (req, res, next) => {
    try {
        let conn = await mssql.getConnection();

        if (!conn._connected)
            return res.status(500).send({ error: 'Database connection not provided.' })

        let favList = [];
        let fav = {};
        const user = req.headers.user;

        let query = await new sql.Request()
            .input('user', user)
            .query('SELECT FAV_ID, FAV_DATE, NEW_ID, NEW_TITLE FROM TB_FAVORITES INNER JOIN TB_NEWS ON NEW_ID = FAV_NEW WHERE FAV_USER = @user');

        let result = query.recordset;

        if (result) {
            result.forEach((value) => {
                fav = {
                    id: value.FAV_ID,
                    date: value.FAV_DATE,
                    new_id: value.NEW_ID,
                    new_title: value.NEW_TITLE
                };
                favList.push(fav);
            });
        }
        return res.status(200).send(favList);

    } catch (error) {
        res.status(500).send({ error: error })
    }
});

router.post('/', async (req, res, next) => {
    try {
        let conn = await mssql.getConnection();

        if (!conn._connected)
            return res.status(500).send({ error: 'Database connection not provided.' })

        let query = await new sql.Request()
            .input('new_id', req.body.new_id)
            .input('date', req.body.date)
            .input('user', req.body.user)
            .query('INSERT INTO TB_FAVORITES (FAV_NEW, FAV_DATE, FAV_USER) VALUES (@new_id, @date, @user)');

        if (query.rowsAffected > 0) {
            return res.status(201).send({
                message: 'Notícia favorita cadastrada com sucesso!',
                inserted_fav: req.body
            });
        }
        return res.status(400).send({
            message: 'Não foi possível cadastrar uma notícia.',
            inserted_fav: req.body
        });

    } catch (error) {
        res.status(500).send({ error: error })
    }
});

router.delete('/:id_fav', async (req, res, next) => {
    try {
        let conn = await mssql.getConnection();

        if (!conn._connected)
            return res.status(500).send({ error: 'Database connection not provided.' })

        const id_fav = req.params.id_fav;

        let query = await new sql.Request()
            .input('id', id_fav)
            .query('DELETE FROM TB_FAVORITES WHERE FAV_ID = @id');

        if (recordSetObject.rowsAffected > 0) {
            return res.status(202).send({
                message: 'Notícia favorita deletada com sucesso!',
                deleted_fav_id: id_fav
            });
        }

        return res.status(404).send({
            message: 'Id da notícia favorita não encontrado.',
            deleted_fav_id: id_fav
        });
    } catch (error) {
        res.status(500).send({ error: error })
    }
});

module.exports = router;