const mongoose = require('mongoose');
const { database } = require('../config/index');

const connection = () => {
  mongoose.set('strictQuery', true);
  mongoose
    .connect(
      database.url.replace('<password>', database.password),
      database.options
    )
    .then(() => console.log('Database is running'))
    .catch((err) => console.error('Database connection error:' + err));
};

module.exports = connection;
