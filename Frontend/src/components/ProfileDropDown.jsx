import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="absolute right-4 top-20 w-72 bg-white border shadow-lg rounded-xl p-4 z-50">
      <div className="flex flex-col items-center space-y-3">
        <img
          src={user.avatarUrl}
          alt="User avatar"
          className="w-16 h-16 rounded-full border"
        />
        <div className="text-center">
          <p className="text-gray-600">Role: <span className="font-semibold">{user.role}</span></p>
          <p className="text-gray-800 font-medium">Name: {user.name}</p>
        </div>
        <button
          onClick={() => navigate("/profile")}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          View Full Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
