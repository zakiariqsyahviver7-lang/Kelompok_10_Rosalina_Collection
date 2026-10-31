require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Rosalina Collection API berjalan' }));
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
