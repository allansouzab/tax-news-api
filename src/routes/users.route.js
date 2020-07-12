const express = require('express');
const router = express.Router();
const mssql = require("../mssql");
const sql = require("mssql");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res, next) => {
    try {
        let conn = await mssql.getConnection();

        if (!conn._connected)
            return res.status(500).send({ error: 'Database connection not provided.' })

        bcrypt.hash(req.body.password, 10, async (errBcrypt, hash) => {
            if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }

            let result = await new sql.Request()
                .input('email', req.body.email)
                .query('SELECT TOP 1 * FROM TB_USERS WHERE USE_EMAIL = @email');

            if (result.recordset.length > 0) {
                return res.status(409).send({ error: 'O usuário já está cadastrado.' })
            }

            let query = await new sql.Request()
                .input('name', req.body.name)
                .input('email', req.body.email)
                .input('cellphone', req.body.cellphone)
                .input('password', hash)
                .input('date', req.body.date)
                .input('status', 1)
                .query('INSERT INTO TB_USERS (USE_NAME, USE_EMAIL, USE_CEL, USE_PASS, USE_DATE, USE_STATUS) VALUES (@name, @email, @cellphone, @password, @date, @status)');

            if (query.rowsAffected > 0) {
                return res.status(201).send({
                    message: 'Novo usuário cadastrado com sucesso!',
                    inserted_user: req.body.email
                });
            }

            return res.status(400).send({
                message: 'Não foi possível cadastrar um novo usuário.',
                inserted_user: req.body.email
            });
        });
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
});

router.post('/login', async (req, res, next) => {
    try {
        let conn = await mssql.getConnection();

        if (!conn._connected)
            return res.status(500).send({ error: 'Database connection not provided.' })

        let result = await new sql.Request()
            .input('email', req.body.email)
            .query('SELECT TOP 1 * FROM TB_USERS WHERE USE_EMAIL = @email');

        if (result.recordset.length == 0) {
            return res.status(401).send({ error: 'Falha na autenticação.' })
        }

        bcrypt.compare(req.body.password, result.recordset[0].USE_PASS, (err, resultToken) => {
            if (err) { return res.status(401).send({ error: 'Falha na autenticação.' }) }

            if (resultToken) {
                const token = jwt.sign({
                    id: result.recordset[0].USE_ID,
                    email: result.recordset[0].USE_EMAIL,
                    nome: result.recordset[0].USE_NOME,
                }, process.env.JWT_KEY, { expiresIn: "1h" });

                return res.status(200).send({ message: 'Autenticado com sucesso.', token: token })
            }

            return res.status(401).send({ error: 'Falha na autenticação.' })
        });

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
});

module.exports = router;