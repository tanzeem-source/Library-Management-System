import React, { useState, useEffect } from "react";
import settingIcon from "../assets/setting.png";
import userIcon from "../assets/user.png";
import { useDispatch, useSelector } from "react-redux";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const [showSettingPopup, setShowSettingPopup] = useState(false);

  const toggleSettingPopup = () => {
    setShowSettingPopup((prev) => !prev);
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      setCurrentTime(`${hours}:${minutes} ${ampm}`);

      const options = { month: "short", day: "numeric", year: "numeric" };
      setCurrentDate(now.toLocaleDateString("en-IN", options));
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
  <>
    <header className="absolute top-0 bg-white w-full py-4 px-6 left-0 shadow-md flex justify-between items-center">
      
      {/* LEFT SIDE: User Profile */}
      <div className="flex items-center gap-2">
        <img src={userIcon} alt="userIcon" className="w-8 h-8" />
        <div className="flex flex-col">
          <span className="text-sm font-medium sm:text-lg lg:text-xl sm:font-semibold">
            {user && user.name}
          </span>
          <span className="text-sm font-medium sm:text-lg sm:font-medium">
            {user && user.role}
          </span>
        </div>
      </div>

      {/* RIGHT SIDE: Grouped Date, Time, and Settings */}
      <div className="flex items-center gap-4">
        
        {/* Date and Time (hidden on tiny screens, looks great on md and up) */}
        <div className="hidden md:flex items-center gap-2 text-sm lg:text-base font-semibold text-gray-700">
          <span>{currentTime}</span>
          <span className="text-gray-300">|</span>
          <span>{currentDate}</span>
        </div>

        {/* Small Elegant Divider Line */}
        <span className="hidden md:block bg-gray-300 h-6 w-[1.5px]" />

        {/* Settings Icon and Popup */}
        <div className="relative">
          <img
            src={settingIcon}
            alt="settingIcon"
            className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={toggleSettingPopup}
          />

          {/* Settings Menu Popup */}
          {showSettingPopup && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg p-4 z-50">
              <p className="text-sm font-medium text-gray-700">Settings Menu</p>
            </div>
          )}
        </div>

      </div>

    </header>
  </>
);
};

export default Header;
