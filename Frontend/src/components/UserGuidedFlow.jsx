import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, LogIn, GitBranch, FileText, BarChart2, Award, Users, Search, Activity } from 'lucide-react';

const UserGuidedFlow = () => {
  return (
    <section id="user-flow" className="py-20 px-8 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-12">How DigiCare Works</h2>
        
        {/* Common Steps */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-indigo-500 text-center mb-10">Getting Started</h3>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center shadow-lg mb-4 border-2 border-indigo-500">
                <UserPlus size={48} className="text-indigo-400" />
              </div>
              <p className="text-white text-center font-medium">Create Account</p>
              <p className="text-gray-400 text-center text-sm mt-2">Register with name, email & password</p>
            </div>
            
            {/* Connector */}
            <div className="hidden md:block w-16 h-1 bg-indigo-500"></div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center shadow-lg mb-4 border-2 border-indigo-500">
                <LogIn size={48} className="text-indigo-400" />
              </div>
              <p className="text-white text-center font-medium">Login</p>
              <p className="text-gray-400 text-center text-sm mt-2">Access your account securely</p>
            </div>
            
            {/* Connector */}
            <div className="hidden md:block w-16 h-1 bg-indigo-500"></div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center shadow-lg mb-4 border-2 border-indigo-500">
                <GitBranch size={48} className="text-indigo-400" />
              </div>
              <p className="text-white text-center font-medium">Choose Path</p>
              <p className="text-gray-400 text-center text-sm mt-2">Select doctor or patient</p>
            </div>
          </div>
        </div>
        
        {/* Patient Journey */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-indigo-500 text-center mb-10">For Patients</h3>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center shadow-lg mb-4 border-2 border-blue-500">
                <FileText size={48} className="text-blue-400" />
              </div>
              <p className="text-white text-center font-medium">Complete Profile</p>
              <p className="text-gray-400 text-center text-sm mt-2">Add DOB, gender & medical history</p>
            </div>
            
            {/* Connector */}
            <div className="hidden md:block w-16 h-1 bg-blue-500"></div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center shadow-lg mb-4 border-2 border-blue-500">
                <Activity size={48} className="text-blue-400" />
              </div>
              <p className="text-white text-center font-medium">Submit Reports</p>
              <p className="text-gray-400 text-center text-sm mt-2">Upload medical records securely</p>
            </div>
            
            {/* Connector */}
            <div className="hidden md:block w-16 h-1 bg-blue-500"></div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center shadow-lg mb-4 border-2 border-blue-500">
                <BarChart2 size={48} className="text-blue-400" />
              </div>
              <p className="text-white text-center font-medium">View Analysis</p>
              <p className="text-gray-400 text-center text-sm mt-2">Review individual reports</p>
            </div>
          </div>
        </div>
        
        {/* Doctor Journey */}
        <div>
          <h3 className="text-2xl font-semibold text-indigo-500 text-center mb-10">For Doctors</h3>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center shadow-lg mb-4 border-2 border-teal-500">
                <Award size={48} className="text-teal-400" />
              </div>
              <p className="text-white text-center font-medium">Verify Credentials</p>
              <p className="text-gray-400 text-center text-sm mt-2">Add qualifications & specialization</p>
            </div>
            
            {/* Connector */}
            <div className="hidden md:block w-16 h-1 bg-teal-500"></div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center shadow-lg mb-4 border-2 border-teal-500">
                <Users size={48} className="text-teal-400" />
              </div>
              <p className="text-white text-center font-medium">Add Patients</p>
              <p className="text-gray-400 text-center text-sm mt-2">Monitor patients under your care</p>
            </div>
            
            {/* Connector */}
            <div className="hidden md:block w-16 h-1 bg-teal-500"></div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center shadow-lg mb-4 border-2 border-teal-500">
                <Search size={48} className="text-teal-400" />
              </div>
              <p className="text-white text-center font-medium">Comprehensive View</p>
              <p className="text-gray-400 text-center text-sm mt-2">Access medical history for better decisions</p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Link to="/register">
            <button className="px-8 py-4 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition-all">
              Get Started Now
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UserGuidedFlow;