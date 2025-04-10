const User = require('../models/user');

const getUser = async (req, res) => {
    try {
        const email = req.body.email;

        const user = await User.findById(email).populate({
            path: 'typeId',
            model: (doc) => doc.userType
        });
        
        console.log(user)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {getUser};
