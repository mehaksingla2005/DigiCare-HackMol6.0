import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFilePdf } from 'react-icons/fa';

const UserProfile = ({ isLoggedIn, user, onLogout }) => {
  const [profileData, setProfileData] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && user?.email) {
      fetch(`${import.meta.env.VITE_API_URL}/users/getProfile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch profile data.');
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

  useEffect(() => {
    if (
      profileData?.userType === 'doctor' &&
      profileData.typeId?.id
    ) {
      fetch(`${import.meta.env.VITE_API_URL}/doctors/${profileData.typeId.id}/patients`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch patients.');
          return res.json();
        })
        .then((data) => setPatients(data))
        .catch(console.error);
    }
  }, [profileData]);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-blue-700">Loading profile...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">{error}</div>;
  if (!profileData) return <div className="min-h-screen flex items-center justify-center text-xl text-blue-700">No profile data available.</div>;

  const isDoctor = profileData.userType === 'doctor';
  const isPatient = profileData.userType === 'patient';
  const details = profileData.typeId || {};

  return (
    <div className="min-h-screen py-10 mt-10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="shadow-2xl rounded-xl p-8 border border-gray-200">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <img
              src={details.profilePhoto || '/placeholder.png'}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md"
            />
            <div className="mt-6 md:mt-0 md:ml-8">
              <h1 className="text-3xl font-bold">{details.fullName || profileData.fullname}</h1>
              <p className="text-gray-600 mt-1">{profileData.email}</p>
              <p className="text-sm text-gray-500 mt-1">User Type: {profileData.userType}</p>
              <div className="mt-4 flex gap-3 flex-wrap">
                
                {/* <Link to="/edit-profile" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow">Edit Profile</Link> */}
                {isPatient && (
                  <Link
                    to={`/patient/profile/${details.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow"
                  >
                    Edit Profile
                  </Link>
                )}
                {isDoctor && (
                  <Link
                    to={`/doctor/profile/${details.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow"
                  >
                    Edit Profile
                  </Link>
                )}
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow">Logout</button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">User Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              {isPatient && (
                <>
                  <p><strong>Phone:</strong> {details.phoneNumber || 'N/A'}</p>
                  <p><strong>Date of Birth:</strong> {details.dateOfBirth ? new Date(details.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Age:</strong> {details.age || 'N/A'}</p>
                  <p><strong>Gender:</strong> {details.gender || 'N/A'}</p>
                  <p><strong>Blood Group:</strong> {details.bloodGroup || 'N/A'}</p>
                </>
              )}
              {isDoctor && (
                <>
                  <p><strong>Phone:</strong> {details.phoneNumber || 'N/A'}</p>
                  <p><strong>Experience:</strong> {details.yearsOfExperience || 'N/A'} years</p>
                  <p><strong>Specializations:</strong> {details.specializations?.join(', ') || 'N/A'}</p>
                </>
              )}
            </div>
          </div>

          {isPatient && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-4">Uploaded Medical Reports</h2>
              {details.documents?.length > 0 ? (
                <div className="space-y-4">
                  {details.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-md shadow-sm hover:shadow-md transition">
                      <div className="flex items-center gap-3">
                        <FaFilePdf className="text-red-500 w-6 h-6" />
                        <a href={doc} target="_blank" rel="noopener noreferrer" className="text-lg text-blue-700 hover:underline">Report {idx + 1}</a>
                      </div>
                      <Link
                        to={`/analyze-report/${idx}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md shadow"
                      >
                        Analyze Report
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No medical reports uploaded.</p>
              )}
            </div>
          )}

          {isPatient && details.doctors?.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-4">Associated Doctors</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {details.doctors.map((doc, idx) => (
                  <div key={idx} className="flex items-center p-4 border rounded-lg shadow hover:shadow-md transition">
                    <img src={doc.profilePhoto || '/placeholder.png'} alt={doc.fullName} className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 mr-4" />
                    <div>
                      <h3 className="text-lg font-medium">{doc.fullName}</h3>
                      <p className="text-sm text-gray-600">{doc.specializations?.join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isDoctor && (
            <div className="mt-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Patients Under Your Care</h2>
                <button
                  onClick={() => navigate('/add-patient')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
                >
                  + Add Patient
                </button>
              </div>
              {patients.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {patients.map((patient) => (
                    <div
                      key={patient.id}
                      className="border rounded-xl shadow-md hover:shadow-lg transition bg-white p-4 flex items-start gap-4"
                    >
                      <img
                        src={patient.profilePhoto || '/placeholder.png'}
                        alt={patient.fullName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                      />
                      <div>
                        <h3 className="text-lg font-bold">{patient.fullName}</h3>
                        <p className="text-sm text-gray-600">Age: {patient.age || 'N/A'}</p>
                        <p className="text-sm text-gray-600">Gender: {patient.gender || 'N/A'}</p>
                        <p className="text-sm text-gray-600">Blood Group: {patient.bloodGroup || 'N/A'}</p>
                        <Link
                          to={`/view-patient/${patient.id}`}
                          className="inline-block mt-2 text-blue-600 hover:underline text-sm"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No patients assigned yet.</p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
