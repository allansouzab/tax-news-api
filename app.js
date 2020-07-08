const express = require('express');
const app = express();
const morgan = require('morgan');

const newsRoute = require('./routes/news');

app.use(morgan('dev'));
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