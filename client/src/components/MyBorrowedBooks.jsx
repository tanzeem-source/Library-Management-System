import React, { useState } from "react";
import { BookA } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import Header from "../layout/Header";
import ReadBookPopup from "../popups/ReadBookPopup";

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();

  const { books } = useSelector((state) => state.book);
  const { userBorrowedBooks } = useSelector((state) => state.borrow);
  const { readBookPopup } = useSelector((state) => state.popup);

  const [readBook, setReadBook] = useState({});
  const [filter, setFilter] = useState("returned");

  const openReadPopup = (id) => {
    const book = books.find((b) => b._id === id);
    if (book) {
      setReadBook(book);
      dispatch(toggleReadBookPopup());
    }
  };

  const formatDate = (timeStamp) => {
    if (!timeStamp) return "N/A";
    const date = new Date(timeStamp);

    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

    return `${formattedDate} ${formattedTime}`;
  };

  const returnedBooks =
    userBorrowedBooks?.filter((book) => book.returned === true) || [];
  const nonReturnedBooks =
    userBorrowedBooks?.filter((book) => book.returned === false) || [];

  const booksToDisplay =
    filter === "returned" ? returnedBooks : nonReturnedBooks;

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />

        {/* Sub Header */}
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center mb-4">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            Borrowed Books
          </h2>
        </header>

        <header className="flex flex-col gap-3 sm:flex-row md:items-center">
          <button
            className={`relative rounded sm:rounded-tr-none sm:rounded-br-none sm:rounded-tl-lg sm:rounded-bl-lg text-center border-2 font-semibold py-2 w-full sm:w-72 transition-colors ${
              filter === "returned"
                ? "bg-black text-white border-black"
                : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setFilter("returned")}
          >
            Returned Books ({returnedBooks.length})
          </button>
          <button
            className={`relative rounded sm:rounded-tl-none sm:rounded-bl-none sm:rounded-tr-lg sm:rounded-br-lg text-center border-2 font-semibold py-2 w-full sm:w-72 transition-colors ${
              filter === "nonReturned"
                ? "bg-black text-white border-black"
                : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setFilter("nonReturned")}
          >
            Non-Returned Books ({nonReturnedBooks.length})
          </button>
        </header>

        {booksToDisplay && booksToDisplay.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Book Title</th>
                  <th className="px-4 py-2 text-left">Date & Time</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                  <th className="px-4 py-2 text-left">Returned</th>
                  <th className="px-4 py-2 text-center">View</th>
                </tr>
              </thead>

              <tbody>
                {booksToDisplay.map((book, index) => {
                  const targetBookId =
                    book.bookId?._id || book.bookId || book._id;

                  return (
                    <tr
                      key={book._id || index}
                      className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2 font-medium">
                        {book.bookTitle || "Unknown Title"}
                      </td>
                      <td className="px-4 py-2">
                        {formatDate(book.borrowedDate || book.createdAt)}
                      </td>
                      <td className="px-4 py-2">{formatDate(book.dueDate)}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                            book.returned
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {book.returned ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => openReadPopup(targetBookId)}
                          className="text-gray-500 hover:text-blue-600 inline-flex items-center justify-center p-1 rounded hover:bg-gray-100 transition-colors"
                          title="View Book details"
                        >
                          <BookA size={20} className="cursor-pointer" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-2xl mt-10 font-medium text-center text-gray-500">
            {filter === "returned"
              ? "No returned books found!"
              : "No non-returned books found!"}
          </h3>
        )}
      </main>

      {readBookPopup && <ReadBookPopup book={readBook} />}
    </>
  );
};

export default MyBorrowedBooks;
