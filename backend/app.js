const express = require("express");
const app = express();
const sequelize = require("./util/database.js");
const bookRoutes = require("./routes/booksRoutes");

const Fine = require('./models/fineBooks');

const Book = require("./models/books");

app.use(express.json());

const cors = require("cors");
app.use(cors());

app.use('/delete-all-data',bookRoutes);
app.use("/", bookRoutes);
Fine.sync();
Book.sync();
sequelize
  .sync()
  .then(() => {
    app.listen(8000, () => {
      console.log("Server is running on port 8000");
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
