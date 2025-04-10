const User = require('../models/user');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');

const getUser = async (req, res) => {
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

module.exports = { getUser };