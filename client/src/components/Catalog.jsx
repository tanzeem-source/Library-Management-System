import React, { useEffect, useState, useMemo } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";
import ReturnBookPopup from "../popups/ReturnBookPopup";
import Header from "../layout/Header";

const Catalog = () => {
  const dispatch = useDispatch();

  const { returnBookPopup } = useSelector((state) => state.popup);
  const {
    error,
    allBorrowedBooks = [],
    message,
  } = useSelector((state) => state.borrow);

  const [filter, setFilter] = useState("borrowed");
  const [email, setEmail] = useState("");
  const [borrowedBookId, setBorrowedBookId] = useState("");

  const formatDateAndTime = (timeStamp) => {
    if (!timeStamp) return "N/A";
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    return `${formattedDate} ${formattedTime}`;
  };

  const formatDate = (timeStamp) => {
    if (!timeStamp) return "N/A";
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const { borrowedBooks, overDueBooks } = useMemo(() => {
    const currentDate = new Date();
    const borrowed = [];
    const overdue = [];

    allBorrowedBooks.forEach((book) => {
      const dueDate = new Date(book.dueDate);
      if (dueDate > currentDate) {
        borrowed.push(book);
      } else {
        overdue.push(book);
      }
    });

    return { borrowedBooks: borrowed, overDueBooks: overdue };
  }, [allBorrowedBooks]);

  const booksToDisplay = filter === "borrowed" ? borrowedBooks : overDueBooks;

  const openReturnBookPopup = (bookId, userEmail) => {
    setBorrowedBookId(bookId);
    setEmail(userEmail);
    dispatch(toggleReturnBookPopup());
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }

    if (error) {
      toast.error(error);
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, error, message]);

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />

        <header className="flex flex-col gap-3 sm:flex-row md:items-center">
          <button
            className={`relative rounded sm:rounded-tr-none sm:rounded-br-none sm:rounded-tl-lg sm:rounded-bl-lg text-center border-2 font-semibold py-2 w-full sm:w-72 transition-colors ${
              filter === "borrowed"
                ? "bg-black text-white border-black"
                : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setFilter("borrowed")}
          >
            Borrowed Books
          </button>
          <button
            className={`relative rounded sm:rounded-tl-none sm:rounded-bl-none sm:rounded-tr-lg sm:rounded-br-lg text-center border-2 font-semibold py-2 w-full sm:w-72 transition-colors ${
              filter === "overdue"
                ? "bg-black text-white border-black"
                : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setFilter("overdue")}
          >
            OverDue Borrowers
          </button>
        </header>

        {booksToDisplay.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Username</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                  <th className="px-4 py-2 text-center">Date & Time</th>
                  <th className="px-4 py-2 text-center">Return</th>
                </tr>
              </thead>

              <tbody>
                {booksToDisplay.map((book, index) => {
                  const targetBookId =
                    book.bookId?._id || book.bookId || book.book || book._id;

                  return (
                    <tr
                      key={book._id || index}
                      className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2 font-medium">
                        {book?.user?.name || "Unknown"}
                      </td>
                      <td className="px-4 py-2">
                        {book?.user?.email || "N/A"}
                      </td>
                      <td className="px-4 py-2">{book.price}</td>
                      <td className="px-4 py-2">{formatDate(book.dueDate)}</td>
                      <td className="px-4 py-2">
                        {formatDateAndTime(book.createdAt)}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {book.returnDate ? (
                          <FaSquareCheck className="w-6 h-6 text-green-600 mx-auto" />
                        ) : (
                          <button
                            onClick={() =>
                              openReturnBookPopup(
                                targetBookId,
                                book?.user?.email,
                              )
                            }
                            type="button"
                          >
                            <PiKeyReturnBold className="w-6 h-6 text-blue-600 hover:scale-110 transition-transform" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-3xl mt-5 font-medium">
            No {filter === "borrowed" ? "borrowed" : "overdue"} books found.
          </h3>
        )}
      </main>

      {returnBookPopup && (
        <ReturnBookPopup bookId={borrowedBookId} userEmail={email} />
      )}
    </>
  );
};

export default Catalog;
