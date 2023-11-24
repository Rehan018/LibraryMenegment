const Sequelize = require("sequelize");
const sequelize = require("../util/database.js");

const Fine = sequelize.define("fine", {
  Name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  fine: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  Returned: {
    type: Sequelize.STRING
  }
});

module.exports = Fine;
