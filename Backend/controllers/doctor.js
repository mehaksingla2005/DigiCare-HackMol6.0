const Doctor = require('../models/doctor');
const User = require('../models/user');

// Create - Register a new doctor
exports.registerDoctor = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    console.log('Received file:', req.file);

    const {
      fullName,
      gender,
      dob,
      email,
      phone,
      clinicAddress,
      city,
      state,
      country,
      availableHours,
      registrationNumber,
      specialization,
      experience,
      degrees
    } = req.body;

    console.log('Extracted fields:', {
      fullName, gender, dob, email, phone, clinicAddress, 
      city, state, country, availableHours, registrationNumber, 
      specialization, experience, degrees
    });

    // Get profile photo URL from the uploaded file (from Cloudinary)
    const profilePhoto = req.file ? req.file.path : null;

    // Validate required fields
    if (!fullName || !gender || !dob || !email || !phone || !clinicAddress || 
        !city || !state || !country || !availableHours || !registrationNumber || 
        !specialization || !experience || !degrees) {
      return res.status(400).json({
        error: 'All fields are required',
        missingFields: {
          fullName: !fullName,
          gender: !gender,
          dob: !dob,
          email: !email,
          phone: !phone,
          clinicAddress: !clinicAddress,
          city: !city,
          state: !state,
          country: !country,
          availableHours: !availableHours,
          registrationNumber: !registrationNumber,
          specialization: !specialization,
          experience: !experience,
          degrees: !degrees
        }
      });
    }

    // Check if a doctor already exists with this email
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({
        error: 'Doctor with this email already exists'
      });
    }

    // Create a new doctor document using the Mongoose model
    const doctor = new Doctor({
      fullName,
      gender,
      dateOfBirth: new Date(dob),
      email,
      phoneNumber: phone,
      profilePhoto,
      clinicAddress,
      city,
      state,
      country,
      availableHours,
      registrationNumber,
      specializations: [specialization],
      yearsOfExperience: parseInt(experience, 10),
      degrees: [degrees],
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

    await doctor.save();

    // Optionally, update the corresponding user record if found
    const user = await User.findOne({ email });
    if (user) {
      user.userType = 'doctor';
      user.typeId = doctor._id;
      user.profileCompleted = true;
      await user.save();
    }

    res.status(201).json({
      message: 'Doctor registered successfully',
      doctor: {
        id: doctor._id,
        fullName: doctor.fullName,
        email: doctor.email,
        specializations: doctor.specializations,
        registrationNumber: doctor.registrationNumber
      }
    });
    
  } catch (error) {
    console.error('Doctor registration error:', error);
    res.status(500).json({
      error: 'Failed to register doctor',
      details: error.message
    });
  }
};

// Read - Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    
    res.status(200).json({
      count: doctors.length,
      doctors: doctors.map(doctor => ({
        id: doctor._id,
        fullName: doctor.fullName,
        email: doctor.email,
        specializations: doctor.specializations,
        city: doctor.city,
        state: doctor.state,
        yearsOfExperience: doctor.yearsOfExperience,
        profilePhoto: doctor.profilePhoto
      }))
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({
      error: 'Failed to fetch doctors',
      details: error.message
    });
  }
};

// Read - Get doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const doctor = await Doctor.findById(id);
    
    if (!doctor) {
      return res.status(404).json({
        error: 'Doctor not found'
      });
    }
    
    res.status(200).json({ doctor });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({
      error: 'Failed to fetch doctor details',
      details: error.message
    });
  }
};

// Read - Search doctors by criteria
exports.searchDoctors = async (req, res) => {
  try {
    const { specialization, city, name } = req.query;
    const query = {};
    
    if (specialization) {
      query.specializations = { $in: [specialization] };
    }
    
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    
    if (name) {
      query.fullName = { $regex: name, $options: 'i' };
    }
    
    const doctors = await Doctor.find(query);
    
    res.status(200).json({
      count: doctors.length,
      doctors: doctors.map(doctor => ({
        id: doctor._id,
        fullName: doctor.fullName,
        specializations: doctor.specializations,
        city: doctor.city,
        state: doctor.state,
        yearsOfExperience: doctor.yearsOfExperience,
        profilePhoto: doctor.profilePhoto
      }))
    });
  } catch (error) {
    console.error('Error searching doctors:', error);
    res.status(500).json({
      error: 'Failed to search doctors',
      details: error.message
    });
  }
};

// Update - Update doctor profile
exports.updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // If file was uploaded, add profile photo path to update data
    if (req.file) {
      updateData.profilePhoto = req.file.path;
    }
    
    // Handle special fields
    if (updateData.dob) {
      updateData.dateOfBirth = new Date(updateData.dob);
      delete updateData.dob;
    }
    
    if (updateData.phone) {
      updateData.phoneNumber = updateData.phone;
      delete updateData.phone;
    }
    
    if (updateData.specialization) {
      updateData.specializations = [updateData.specialization];
      delete updateData.specialization;
    }
    
    if (updateData.experience) {
      updateData.yearsOfExperience = parseInt(updateData.experience, 10);
      delete updateData.experience;
    }
    
    if (updateData.degrees) {
      updateData.degrees = [updateData.degrees];
    }
    
    const doctor = await Doctor.findByIdAndUpdate(
      id, 
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!doctor) {
      return res.status(404).json({
        error: 'Doctor not found'
      });
    }
    
    res.status(200).json({
      message: 'Doctor profile updated successfully',
      doctor: {
        id: doctor._id,
        fullName: doctor.fullName,
        email: doctor.email,
        specializations: doctor.specializations,
        city: doctor.city,
        state: doctor.state
      }
    });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({
      error: 'Failed to update doctor profile',
      details: error.message
    });
  }
};

// Delete - Delete doctor profile
exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    
    const doctor = await Doctor.findById(id);
    
    if (!doctor) {
      return res.status(404).json({
        error: 'Doctor not found'
      });
    }
    
    // Get the doctor's email before deletion
    const doctorEmail = doctor.email;
    
    // Delete the doctor
    await Doctor.findByIdAndDelete(id);
    
    // Update the associated user if found
    const user = await User.findOne({ email: doctorEmail });
    if (user) {
      user.userType = 'user';  // Reset back to regular user
      user.typeId = null;
      user.profileCompleted = false;
      await user.save();
    }
    
    res.status(200).json({
      message: 'Doctor profile deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({
      error: 'Failed to delete doctor profile',
      details: error.message
    });
  }
};