import React from "react";
import { useSelector } from "react-redux";
import Header from "../layout/Header";

const Users = () => {
  const { users } = useSelector((state) => state.user);

  const filteredUsers = users ? users.filter((u) => u.role === "User") : [];

  const formatDate = (timeStamp) => {
    if (!timeStamp) return "N/A";
    const date = new Date(timeStamp);

    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        {/* Sub Header */}
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            Registered Users
          </h2>
        </header>

        {/* TABLE */}
        {filteredUsers.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-center">
                    No. of books borrowed
                  </th>
                  <th className="px-4 py-2 text-center">Registered on</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="px-4 py-2 text-left">{index + 1}</td>
                    <td className="px-4 py-2 text-left">
                      {user.name || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-left">
                      {user.email || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-left">{user.role}</td>
                    {/* Adjust "borrowedBooks" below to match your actual backend property name */}
                    <td className="px-4 py-2 text-center">
                      {user.borrowedBooks?.length || 0}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-3xl mt-5 font-medium">
            No registered users found in library.
          </h3>
        )}
      </main>
    </>
  );
};

export default Users;
