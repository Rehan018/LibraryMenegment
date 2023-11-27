const express = require('express');
const router = express.Router();
const bookController = require('../controllers/booksController');

router.post('/add-book', bookController.createBook);

router.get('/get-book', bookController.getAllBooks);

router.delete('/delete/:id', bookController.deleteBooks);

router.post('/add-fine', bookController.createFine);

router.get('/get-fine/:Id',bookController.getFine);

router.get('/get-fine',bookController.getAllFines);

router.post('/return-book', bookController.returnBook);


module.exports = router;
