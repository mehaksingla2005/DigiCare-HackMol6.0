import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFilePdf } from 'react-icons/fa';

const UserProfile = ({ isLoggedIn, user, onLogout }) => {
  const [profileData, setProfileData] = useState(null);
  const [patients, setPatients] = useState([]); // for doctor: list of patients
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch full profile details from your API using the email from the passed user
  useEffect(() => {
    if (isLoggedIn && user && user.email) {
      fetch(`${import.meta.env.VITE_API_URL}/users/getProfile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch profile data.');
          }
          return res.json();
        })
        .then((data) => {
          setProfileData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [isLoggedIn, user]);

  // If the user is a doctor, fetch the list of patients under their care.
  useEffect(() => {
    if (
      profileData &&
      profileData.userType === 'doctor' &&
      profileData.typeId &&
      profileData.typeId.id
    ) {
      fetch(`${import.meta.env.VITE_API_URL}/doctors/${profileData.typeId.id}/patients`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch patients.');
          return res.json();
        })
        .then((data) => setPatients(data))
        .catch((err) => console.error(err));
    }
  }, [profileData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-blue-700">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        {error}
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-blue-700">
        No profile data available.
      </div>
    );
  }

  // Determine type
  const isDoctor = profileData.userType === 'doctor';
  const isPatient = profileData.userType === 'patient';
  // Detailed profile data from your type-specific model
  const details = profileData.typeId || {};

  return (
    <div className="min-h-screen bg-blue-50 py-10 mt-10">
      <div className="max-w-6xl mx-auto p-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-500 shadow-2xl rounded-xl p-8 flex flex-col md:flex-row items-center text-white">
          <img
            src={details.profilePhoto || '/placeholder.png'}
            alt="Profile"
            className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div className="mt-6 md:mt-0 md:ml-10 text-center md:text-left">
            <h1 className="text-4xl font-extrabold">{details.fullName || profileData.fullname}</h1>
            <p className="text-lg opacity-90 mt-2">{profileData.email}</p>
            {isPatient && (
              <div className="mt-4 space-y-1">
                <p className="text-sm">Phone: {details.phoneNumber || 'N/A'}</p>
                <p className="text-sm">
                  Date of Birth:{" "}
                  {details.dateOfBirth ? new Date(details.dateOfBirth).toLocaleDateString() : "N/A"}
                </p>
                <p className="text-sm">Age: {details.age || 'N/A'}</p>
                <p className="text-sm">Gender: {details.gender || 'N/A'}</p>
                <p className="text-sm">Blood Group: {details.bloodGroup || 'N/A'}</p>
              </div>
            )}
            {isDoctor && (
              <div className="mt-4 space-y-1">
                <p className="text-sm">Phone: {details.phoneNumber || 'N/A'}</p>
                <p className="text-sm">
                  Experience: {details.yearsOfExperience || 'N/A'} years
                </p>
                {details.specializations && (
                  <p className="text-sm">
                    Specializations: {details.specializations.join(', ')}
                  </p>
                )}
              </div>
            )}
            <div className="mt-6 space-x-4">
              <Link
                to="/edit-profile"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-shadow shadow-md"
              >
                Edit Profile
              </Link>
              {isPatient && (
                <Link
                  to="/analyze-reports"
                  className="px-5 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-full transition-shadow shadow-md"
                >
                  Analyze Reports
                </Link>
              )}
              <button
                onClick={onLogout}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-shadow shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Patient Specific Section */}
        {isPatient && (
          <div className="mt-10">
            {/* Medical Reports */}
            <h2 className="text-3xl font-semibold text-blue-800 mb-6">Medical Reports</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {details.documents && details.documents.length > 0 ? (
                details.documents.map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <FaFilePdf className="w-10 h-10 text-red-500" />
                      <span className="text-xl font-medium text-gray-700 truncate">Report {idx + 1}</span>
                    </div>
                  </a>
                ))
              ) : (
                <p className="text-gray-600 text-lg">No medical reports available.</p>
              )}
            </div>

            {/* Associated Doctors */}
            <div className="mt-10">
              <h2 className="text-3xl font-semibold text-blue-800 mb-6">Associated Doctors</h2>
              {details.doctors && details.doctors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {details.doctors.map((doc, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition duration-300"
                    >
                      <img
                        src={doc.profilePhoto || '/placeholder.png'}
                        alt={doc.fullName}
                        className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                      />
                      <h3 className="mt-4 text-xl font-semibold text-gray-800">{doc.fullName}</h3>
                      {doc.specializations && (
                        <p className="text-gray-600 text-sm text-center">
                          {doc.specializations.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-lg">No associated doctors.</p>
              )}
            </div>
          </div>
        )}

        {/* Doctor Specific Section */}
        {isDoctor && (
          <div className="mt-10">
            <h2 className="text-3xl font-semibold text-blue-800 mb-6">Patients Under Your Care</h2>
            {patients && patients.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition duration-300"
                  >
                    <img
                      src={patient.profilePhoto || '/placeholder.png'}
                      alt={patient.fullName}
                      className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                    />
                    <h3 className="mt-4 text-xl font-semibold text-gray-800">{patient.fullName}</h3>
                    <p className="text-gray-600 text-sm">Age: {patient.age}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-lg">No patients found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
