import React from "react";
import dummyUser from "../data/DummyUser";

const UserProfile = () => {
  const reports = [
    { id: 1, title: "Blood Report - March 2025" },
    { id: 2, title: "X-Ray Report - April 2025" },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <img src={dummyUser.avatarUrl} className="w-20 h-20 rounded-full" />
        <div>
          <h2 className="text-2xl font-bold">{dummyUser.name}</h2>
          <p className="text-gray-600">Role: {dummyUser.role}</p>
          <p className="text-sm text-gray-500">{dummyUser.bio}</p>
          <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded">
            Edit Profile
          </button>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-3">Uploaded Reports</h3>
      {reports.map((report) => (
        <div
          key={report.id}
          className="flex justify-between items-center border p-3 rounded mb-2"
        >
          <p>{report.title}</p>
          <button className="bg-blue-500 text-white px-3 py-1 rounded">
            Analyze Report
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserProfile;
