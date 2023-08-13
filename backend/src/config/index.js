require('dotenv').config();

module.exports = {
  application: {
    port: process.env.DEV_PORT,
    jwtToken: process.env.JWT_TOKEN,
  },
  database: {
    url: process.env.DATABASE_URL,
    password: process.env.DATABASE_PASSWORD,
    options: {
      useUnifiedTopology: true,
    },
  },
};
