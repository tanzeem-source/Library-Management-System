import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Borrow } from "../models/borrowModel.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import { calculateFine } from "../utils/fineCalculator.js";

//API to record borrowed book
export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { email } = req.body;

  const book = await Book.findById(id);
  if (!book) {
    return next(new ErrorHandler("Book not found.", 404));
  }

  const user = await User.findOne({ email, accountVerified: true });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  if (book.quantity === 0) {
    return next(new ErrorHandler("Book not available.", 400));
  }

  const isAlreadyBorrowed = user.borrowedBooks.find(
    (b) => b.bookId.toString() === id && b.returned === false,
  );

  if (isAlreadyBorrowed) {
    return next(new ErrorHandler("Book already borrowed", 400));
  }

  //  Update book inventory
  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  const calculatedDueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Update user profile array
  user.borrowedBooks.push({
    bookId: book._id,
    bookTitle: book.title,
    borrowedDate: new Date(),
    dueDate: calculatedDueDate,
  });
  await user.save();

  //  Create Borrow Record
  await Borrow.create({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      price: book.price,
      book: book._id,
      dueDate: calculatedDueDate,
    },
  });

  res.status(200).json({
    success: true,
    message: "Borrowed book recorded successfully",
  });
});


//API for returning borrowed book
export const returnBorrowBook = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;
  const { email } = req.body;
  const book = await Book.findById(bookId);

  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  const user = await User.findOne({ email, accountVerified: true });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const borrowedBook = user.borrowedBooks.find(
    (b) => b.bookId.toString() === bookId && b.returned === false,
  );

  if (!borrowedBook) {
    return next(new ErrorHandler("You have not borrowed this book.", 400));
  }

  const borrow = await Borrow.findOne({
    "user.book": bookId,       
    "user.email": email,       
    "user.returnDate": null,   
  });

  if (!borrow) {
    return next(new ErrorHandler("You have not borrowed this book.", 400));
  }

  
  borrowedBook.returned = true;
  await user.save();

  book.quantity += 1;
  book.availability = book.quantity > 0;
  await book.save();

  
  borrow.user.returnDate = new Date(); 

  const fine = calculateFine(borrow.user.dueDate); // Added .user

  borrow.user.fine = fine; // Added .user

  await borrow.save();

  res.status(200).json({
    success: true,
    message:
      fine !== 0
        ? `The book has been returned successfully. The total charges, including a fine, are Rs. ${fine + book.price} `
        : `The book has been returned successfully. The total charges are Rs. ${book.price}`,
  });
});

//API for fetching books details borrowed by a user
export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {

  const {borrowedBooks} = req.user;

  res.status(200).json({
    success: true,
    borrowedBooks,
  })
});

//API for fetching all book details borrowed by all the users
export const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {

  const borrowedBooks = await Borrow.find();

  res.status(200).json({
    success : true,
    borrowedBooks,
  })
},
);
