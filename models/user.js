const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  isAdmin: Sequelize.BOOLEAN
});

module.exports = User;
