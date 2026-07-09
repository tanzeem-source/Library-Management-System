import React, { useState } from "react";
import placeHolder from "../assets/placeholder.jpg";
import closeIcon from "../assets/close-square.png";
import keyIcon from "../assets/key.png";
import { useDispatch, useSelector } from "react-redux";
import { addNewAdmin } from "../store/slices/userSlice";
import { toggleAddNewAdminPopup } from "../store/slices/popUpSlice";

const AddNewAdmin = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNewAdmin = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    dispatch(addNewAdmin(formData));
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
        <div className="w-full bg-white rounded-lg shadow-lg md:w-1/3">
          <div className="p-6">
            <header className="flex justify-between items-center mb-7 pb-5 border-b-[1px] border-gray-200">
              <div className="flex items-center gap-3">
                <img
                  src={keyIcon}
                  alt="key-icon"
                  className="bg-gray-100 p-3 rounded-lg w-12 h-12"
                />
                <h3 className="text-xl font-bold">Add New Admin</h3>
              </div>
              <img
                src={closeIcon}
                alt="close-icon"
                className="cursor-pointer"
                onClick={() => dispatch(toggleAddNewAdminPopup())}
              />
            </header>

            <form onSubmit={handleAddNewAdmin} className="flex flex-col gap-4">
              {/* Avatar Selection */}
              <div className="flex flex-col items-center justify-center mb-2">
                <label
                  htmlFor="avatarInput"
                  className="cursor-pointer group relative"
                >
                  <img
                    src={avatarPreview ? avatarPreview : placeHolder}
                    alt="avatar"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-500 transition-all"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <span className="text-white text-xs font-medium">
                      Change
                    </span>
                  </div>
                  <input
                    type="file"
                    id="avatarInput"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md outline-none focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full bg-gray-600 text-white py-2 rounded-md font-semibold hover:bg-black transition-colors disabled:bg-gray-300"
              >
                {loading ? "Adding..." : "Add Admin"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNewAdmin;
