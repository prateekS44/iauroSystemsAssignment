const Sequelize = require('sequelize');

const dbPassword = process.env.DB_PASS || "";
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, dbPassword, {
  dialect: 'mysql',
  host: process.env.DB_HOST
});

module.exports = sequelize;