import React, { useState } from "react";
import closeIcon from "../assets/close-square.png";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../store/slices/authSlice";
import settingIcon from "../assets/setting.png";
import { toggleSettingPopup } from "../store/slices/popUpSlice";

const SettingPopup = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match!");
      return;
    }

    const data = new FormData();
    data.append("currentPassword", currentPassword);
    data.append("newPassword", newPassword);
    data.append("confirmNewPassword", confirmNewPassword);

    try {
      await dispatch(updatePassword(data)).unwrap();
      dispatch(toggleSettingPopup());
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

    } catch (error) {
      console.error("Password update failed: ", error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
        <div className="w-full bg-white rounded-lg shadow-lg sm:w-auto lg:w-1/2 2xl:w-1/3">
          <div className="p-6">
            <header className="flex justify-between items-center mb-7 pb-5 border-b-[1px] border-gray-200">
              <div className="flex items-center gap-3">
                <img
                  src={settingIcon}
                  alt="setting-icon"
                  className="bg-gray-100 p-3 rounded-lg w-12 h-12"
                />
                <h3 className="text-xl font-bold">Change Credentials</h3>
              </div>
              <img
                src={closeIcon}
                alt="close-icon"
                className="cursor-pointer"
                onClick={() => dispatch(toggleSettingPopup())}
              />
            </header>

            <form
              onSubmit={handleUpdatePassword}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md outline-none focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full bg-gray-600 text-white py-2 rounded-md font-semibold hover:bg-black transition-colors disabled:bg-gray-300"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingPopup;