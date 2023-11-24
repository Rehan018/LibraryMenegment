
const Sequelize  = require('sequelize');

const sequelize = new Sequelize('library_db', 'root', '', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
