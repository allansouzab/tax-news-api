const express = require('express');
const app = express();

const newsRoute = require('./routes/news');

app.use('/api/news', newsRoute);

module.exports = app;