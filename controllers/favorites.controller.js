const mssql = require("../mssql");
const sql = require("mssql");

exports.getFavorites = async (req, res, next) => {
    try {
        let conn = await mssql.getConnection();

        if (!conn._connected || !conn)
            return res.status(500).send({ error: 'Database connection not provided.' })

        let favList = [];
        let fav = {};
        let user = req.user;

        let query = await new sql.Request()
            .input('email', user.email)
            .query('SELECT FAV_ID, FAV_DATE, NEW_ID, NEW_TITLE FROM TB_FAVORITES INNER JOIN TB_NEWS ON NEW_ID = FAV_NEW INNER JOIN TB_USERS ON USE_ID = FAV_USER WHERE USE_EMAIL = @email');

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
        res.status(500).send({ error: error.message })
    }
};

exports.postFavorite = async (req, res, next) => {
    try {
        let conn = await mssql.getConnection();

        if (!conn._connected || !conn)
            return res.status(500).send({ error: 'Database connection not provided.' })

        let user = req.user;

        let result = await new sql.Request()
            .input('new_id', req.body.new_id)
            .input('email', user.email)
            .query('SELECT TOP 1 * FROM TB_FAVORITES INNER JOIN TB_USERS ON USE_ID = FAV_USER WHERE FAV_NEW = @new_id AND USE_EMAIL = @email');

        if (result.recordset.length > 0) {
            return res.status(409).send({ error: 'Esta notícia já está salva nos seus favoritos.' })
        }

        let query = await new sql.Request()
            .input('new_id', req.body.new_id)
            .input('date', req.body.date)
            .input('user', user.id)
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
        res.status(500).send({ error: error.message })
    }
};

exports.deleteFavorite = async (req, res, next) => {
    try {
        let conn = await mssql.getConnection();

        if (!conn._connected || !conn)
            return res.status(500).send({ error: 'Database connection not provided.' })

        const id_fav = req.params.id_fav;

        let query = await new sql.Request()
            .input('id', id_fav)
            .query('DELETE FROM TB_FAVORITES WHERE FAV_ID = @id');

        if (query.rowsAffected > 0) {
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
        res.status(500).send({ error: error.message })
    }
};