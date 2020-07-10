const express = require('express');
const router = express.Router();
const mssql = require("../mssql");
const sql = require("mssql");

router.get('/', async (req, res, next) => {
    try {
        let conn = await mssql.getConnection();

        if (!conn._connected)
            return res.status(500).send({ error: 'Database connection not provided.' })

        let reminderList = [];
        let reminder = {};
        const user = req.headers.user;

        new sql.Request()
            .input('user', user)
            .query('SELECT REM_ID, REM_DATE, NEW_ID, NEW_TITLE FROM TB_REMINDER INNER JOIN TB_NEWS ON NEW_ID = REM_NEW WHERE REM_USER = @user', function (err, recordSetObject) {
                if (err) { return res.status(500).send({ error: err }) }

                let result = recordSetObject.recordset;

                if (result) {
                    result.forEach((value) => {
                        reminder = {
                            id: value.REM_ID,
                            date: value.REM_DATE,
                            new_id: value.NEW_ID,
                            new_title: value.NEW_TITLE
                        };
                        reminderList.push(reminder);
                    });
                }
                return res.status(200).send(reminderList);
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

        new sql.Request()
            .input('new_id', req.body.new_id)
            .input('date', req.body.date)
            .input('user', req.body.user)
            .query('INSERT INTO TB_REMINDER (REM_NEW, REM_DATE, REM_USER) VALUES (@new_id, @date, @user)', function (err, recordSetObject) {
                if (err) { return res.status(500).send({ error: err }) }

                if (recordSetObject.rowsAffected > 0) {
                    return res.status(201).send({
                        message: 'Lembre para notícia cadastrado com sucesso!',
                        inserted_reminder: req.body
                    });
                }
            });
    } catch (error) {
        res.status(500).send({ error: error })
    }
});

router.delete('/:id_reminder', async (req, res, next) => {
    try {
        let conn = await mssql.getConnection();

        if (!conn._connected)
            return res.status(500).send({ error: 'Database connection not provided.' })

        const id_reminder = req.params.id_reminder;

        new sql.Request()
            .input('id', id_reminder)
            .query('DELETE FROM TB_REMINDER WHERE REM_ID = @id', function (err, recordSetObject) {
                if (err) { return res.status(500).send({ error: err }) }

                if (recordSetObject.rowsAffected > 0) {
                    return res.status(202).send({
                        message: 'Lembrete de notícia deletado com sucesso!',
                        deleted_reminder_id: id_reminder
                    });
                }

                return res.status(404).send({
                    message: 'Id do lembrete não encontrado.',
                    deleted_reminder_id: id_reminder
                });
            });
    } catch (error) {
        res.status(500).send({ error: error })
    }
});

module.exports = router;