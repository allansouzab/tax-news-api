const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const newsRoute = require('./routes/news.route');
const favoritesRoute = require('./routes/favorites.route');
const remindersRoute = require('./routes/reminders.route');
const usersRoute = require('./routes/users.route');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
});

app.use('/api/news', newsRoute);
app.use('/api/favorites', favoritesRoute);
app.use('/api/reminders', remindersRoute);
app.use('/api/users', usersRoute);

app.get('/api', (req, res) => {
    res.status(200).send({
        success: true,
        message: 'API de notícias sobre o mercado tributário.',
        version: '1.0.0',
    });
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            message: error.message
        }
    });
});

module.exports = app;