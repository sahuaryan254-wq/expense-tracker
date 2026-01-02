const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Update user profile
// @route   PUT /api/user/update
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.user.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }

        if (req.body.profileImage) {
            user.profileImage = req.body.profileImage;
        }

        if (req.body.monthlyBudget !== undefined) {
            user.monthlyBudget = req.body.monthlyBudget;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser.id,
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            profileImage: updatedUser.profileImage,
            monthlyBudget: updatedUser.monthlyBudget,
            token: req.headers.authorization.split(' ')[1],
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    updateUserProfile,
};
