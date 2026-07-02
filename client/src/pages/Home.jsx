import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import SideBar from "../layout/SideBar";

import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import BookManagement from "../components/BookManagement";
import Catalog from "../components/Catalog";
import Users from "../components/Users"; 
import MyBorrowedBooks from "../components/MyBorrowedBooks"; 

const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("");

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <div className="relative md:pl-64 flex min-h-screen bg-gray-100">
        
        {/* Mobile Hamburger Header Trigger */}
        <div className="md:hidden z-10 absolute right-6 top-4 sm:top-6 flex justify-center items-center bg-black rounded-md h-9 w-9 text-white">
          <GiHamburgerMenu
            className="text-2xl hover:cursor-pointer"
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          />
        </div>

        {/* Sidebar Component */}
        <SideBar
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
          setSelectedComponent={setSelectedComponent}
        />

        {/* Main Content Pane: Dynamic View Selection */}
        {(() => {
          switch (selectedComponent) {
            case "Dashboard":
              return user?.role === "User" ? <UserDashboard /> : <AdminDashboard />;

            case "Books":
              return <BookManagement />;

            case "Catalog":
              if (user?.role === "Admin") {
                return <Catalog />;
              }
              return null; // Fallback container protection

            case "Users":
              if (user?.role === "Admin") {
                return <Users />;
              }
              return null;

            case "My Borrowed Books":
              return <MyBorrowedBooks />;

            default:
              return user?.role === "User" ? <UserDashboard /> : <AdminDashboard />;
          }
        })()}
        
      </div>
    </>
  );
};

export default Home;