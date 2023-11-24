
const Sequelize= require('sequelize');
const sequelize = require('../util/database.js');

const Book = sequelize.define('books', {
  bookName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Book;
