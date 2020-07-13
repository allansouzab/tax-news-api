const mssql = require("../mssql");
const sql = require("mssql");

exports.getReminders = async (req, res, next) => {
    try {
        let conn = await mssql.getConnection();

        if (!conn._connected)
            return res.status(500).send({ error: 'Database connection not provided.' })

        let reminderList = [];
        let reminder = {};
        const user = req.user;

        let query = await new sql.Request()
            .input('user', user.id)
            .query('SELECT REM_ID, REM_DATE, NEW_ID, NEW_TITLE FROM TB_REMINDERS INNER JOIN TB_NEWS ON NEW_ID = REM_NEW WHERE REM_USER = @user');

        let result = query.recordset;

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
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
};

exports.postReminder = async (req, res, next) => {
    try {
        let conn = await mssql.getConnection();

        if (!conn._connected)
            return res.status(500).send({ error: 'Database connection not provided.' })

        const user = req.user;

        let result = await new sql.Request()
            .input('new_id', req.body.new_id)
            .input('user', req.user.id)
            .query('SELECT TOP 1 * FROM TB_REMINDERS WHERE REM_NEW = @new_id AND REM_USER = @user');

        if (result.recordset.length > 0) {
            return res.status(409).send({ error: 'Esta notícia já está salva nos seus lembretes.' })
        }

        let query = await new sql.Request()
            .input('new_id', req.body.new_id)
            .input('date', req.body.date)
            .input('user', req.user.id)
            .query('INSERT INTO TB_REMINDERS (REM_NEW, REM_DATE, REM_USER) VALUES (@new_id, @date, @user)');

        if (query.rowsAffected > 0) {
            return res.status(201).send({
                message: 'Lembrete para notícia cadastrado com sucesso!',
                inserted_reminder: req.body
            });
        }

        return res.status(400).send({
            message: 'Não foi possível cadastrar um lembrete de notícia.',
            inserted_reminder: req.body
        });

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
};

exports.deleteReminder = async (req, res, next) => {
    try {
        let conn = await mssql.getConnection();

        if (!conn._connected)
            return res.status(500).send({ error: 'Database connection not provided.' })

        const id_reminder = req.params.id_reminder;

        let query = await new sql.Request()
            .input('id', id_reminder)
            .query('DELETE FROM TB_REMINDERS WHERE REM_ID = @id');

        if (query.rowsAffected > 0) {
            return res.status(202).send({
                message: 'Lembrete de notícia deletado com sucesso!',
                deleted_reminder_id: id_reminder
            });
        }

        return res.status(404).send({
            message: 'Id do lembrete não encontrado.',
            deleted_reminder_id: id_reminder
        });
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
};