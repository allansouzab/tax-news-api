const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const newsRoute = require('./routes/news');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/news', newsRoute);

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;