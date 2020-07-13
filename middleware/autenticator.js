const jwt = require('jsonwebtoken');
const mssql = require("../mssql");
const sql = require("mssql");

exports.login = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).send({ message: "Falha na autenticação." })
    }
}

exports.administrator = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_KEY);

        let conn = await mssql.getConnection();

        if (!conn._connected || !conn)
            return res.status(500).send({ error: 'Database connection not provided.' })

        let query = await new sql.Request()
            .input('email', decode.email)
            .input('adm', sql.Int, 1)
            .query('SELECT * FROM TB_USERS WHERE USE_EMAIL = @email AND USE_ADM = @adm');

        if (query.recordset.length == 0) {
            return res.status(401).send({ message: "Falha na autenticação." })
        }
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).send({ message: "Falha na autenticação." })
    }
}