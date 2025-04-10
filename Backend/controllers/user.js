const User = require('../models/user');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');

exports.getUser = async (req, res) => {
    try {
        const email = req.body.email;

        // First find the user without population
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Then manually populate the typeId based on userType
        let populatedData = null;
        
        if (user.userType === 'doctor' && user.typeId) {
            populatedData = await Doctor.findById(user.typeId);
        } else if (user.userType === 'patient' && user.typeId) {
            populatedData = await Patient.findById(user.typeId);
        }

        // Create a response object with the populated data
        const responseUser = user.toObject();
        if (populatedData) {
            responseUser.typeId = populatedData;
        }

        console.log('User found:', responseUser);
        res.status(200).json(responseUser);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Validate email is provided
      if (!email) {
        return res.status(400).json({
          error: 'Email is required'
        });
      }
  
      // Find user by email
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }
  
      // Prepare the response with user data
      const userData = {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        userType: user.userType,
        profileCompleted: user.profileCompleted
      };
  
      // If user has a type (doctor or patient), fetch the corresponding profile data
      if (user.userType === 'doctor' && user.typeId) {
        const doctorProfile = await Doctor.findById(user.typeId);
        if (doctorProfile) {
          userData.typeId = {
            id: doctorProfile._id,
            fullName: doctorProfile.fullName,
            specializations: doctorProfile.specializations,
            email: doctorProfile.email,
            phoneNumber: doctorProfile.phoneNumber,
            profilePhoto: doctorProfile.profilePhoto,
            city: doctorProfile.city,
            state: doctorProfile.state,
            yearsOfExperience: doctorProfile.yearsOfExperience
          };
        }
      } else if (user.userType === 'patient' && user.typeId) {
        const patientProfile = await Patient.findById(user.typeId);
        if (patientProfile) {
          userData.typeId = {
            id: patientProfile._id,
            fullName: patientProfile.fullName,
            email: patientProfile.email,
            phoneNumber: patientProfile.phoneNumber,
            profilePhoto: patientProfile.profilePhoto,
            age: patientProfile.age,
            gender: patientProfile.gender,
            bloodGroup: patientProfile.bloodGroup
          };
        }
      }
  
      res.status(200).json(userData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({
        error: 'Failed to fetch user profile',
        details: error.message
      });
    }
  };
