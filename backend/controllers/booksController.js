
const Book = require('../models/books');

const Fine = require('../models/fineBooks');

exports.createFine = async (req,res) =>{
  const {Name,fine,Returned} = req.body;
  try{
    const FineBook = await Fine.create({Name,fine,Returned});
    res.status(201).json(FineBook);
  } catch(error){
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllFines = async (req, res) => {
  try {
    const fines = await Fine.findAll(); 
    res.status(200).json(fines); 
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFine= async (req, res, next) => {
  try {
    const id = req.params.Id;
    const fine = await Book.findByPk(id);
    console.log("fine is here",fine);
    if (!fine) {
      return res.status(404).json({ err: "fine not found" });
    }
    res.json(fine);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Server error" });
  }
};


exports.createBook = async (req, res) => {
  const { bookName } = req.body;
  try {
    const currentDate = new Date();
    const dueDate = new Date(currentDate);
    dueDate.setMinutes(currentDate.getMinutes() + 5); // Set dueDate to 5 minutes later

    const book = await Book.create({ bookName, updatedAt: currentDate, dueDate });
    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteBooks = async (req, res, next) => {
    try {
      const id = req.params.id;
  
      const book = await Book.findByPk(id);
  
      if (!book) {
        return res.status(404).json({ err: 'Book not found' });
      }
  
      await book.destroy();
  
      res.status(204).json({ message: 'Book deleted successfully' });
    } catch (error) {
      console.error('Error deleting book:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
// ------------------------
exports.returnBook = async (req, res) => {
  const { bookId } = req.body;
  try {
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ err: 'Book not found' });
    }

    const fineAmount = calculateFine(book);

    if (fineAmount > 0) {
      const Returned = new Date().toLocaleString();
      const fineRecord = await Fine.create({ Name: book.bookName, fine: fineAmount, Returned });
      res.json({ message: 'Fine calculated', fineRecord });
    } else {
      await book.destroy();
      res.json({ message: 'Book returned successfully', fine: 0 });
    }
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


const calculateFine = (book) => {
  const createdAtTimestamp = new Date(book.createdAt);
  const updatedAtdueDate = new Date(book.updatedAt);
  const minutesDifference = Math.floor((updatedAtdueDate - createdAtTimestamp) / (1000 * 60));
  const fineRatePerMinute = 5;
  const fineAmount = Math.max(minutesDifference, 0) * fineRatePerMinute;
  return fineAmount;
};
