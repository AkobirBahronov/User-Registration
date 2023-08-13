const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const userRoutes = require('./routes/userRoutes');
const HttpError = require('./models/http-error.model');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/users', userRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  next(error);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

module.exports = app;
