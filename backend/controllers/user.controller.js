const userCollection = require("../models/user.model");
const { ErrorHandler } = require("../middlewares/Error.middleware");
const bcrypt = require("bcrypt")
const formatDate = require("../utils/formatDate");
const formatCreatedOn = require("../utils/formatCreatedOn");


// Get a user by ID
const getUser = async (req, res, next) => {
    try {
        const user = await userCollection.findById(req.params.id);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const formattedUser = {
            _id: user._id,
            name: user.name,
            age: user.age,
            dob: formatDate(user.dob),
            gender: user.gender,
            about: user.about,
        };

        res.status(200).json({
            success: true,
            user: formattedUser
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};


// Get all users
const getAllUser = async (req, res, next) => {
    try {
        const users = await userCollection.find().select('name age dob gender createdAt');

        const formattedUsers = users.map(user => ({
            _id : user._id,
            name: user.name,
            age: user.age,
            dob: formatDate(user.dob),
            gender: user.gender,
            createdOn: formatCreatedOn(user.createdAt)
        }));

        res.status(200).json({
            success: true,
            users: formattedUsers
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};


// Get all unique genders from users
const getAllGender = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            genders : ['Male', 'Female', 'Other']
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500))
    }
};

// Add a new user
const addUser = async (req, res, next) => {
    try {
        const { name, age, dob, gender, about, password } = req.body;

        const existingUser = await userCollection.findOne({
            name,
            age,
            dob,
            gender,
        }).collation({ locale: 'en', strength: 2 });

        if (existingUser) {
            return next(new ErrorHandler(`User already exists.`, 409));
        }

        const hashed_password = await bcrypt.hash(password, 10);

        const user = await userCollection.create({ name, age, dob, gender, about, password: hashed_password });

        res.status(201).json({
            success: true,
            message: "User added successfully",
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};



// Edit a user by ID
const editUser = async (req, res, next) => {
    try {
        const { password, ...updateFields } = req.body; 

        if (!password) {
            return next(new ErrorHandler("Password is required", 400));
        }

        const currentUser = await userCollection.findById(req.params.id).select('+password'); 

        if (!currentUser) {
            return next(new ErrorHandler("User not found", 404));
        }

        const isMatch = await bcrypt.compare(password, currentUser.password); 

        if (!isMatch) {
            return next(new ErrorHandler("Invalid password or Unauthorised user", 401));
        }

        const duplicateUser = await userCollection.findOne({
            name: updateFields.name || currentUser.name,
            age: updateFields.age || currentUser.age,
            dob: updateFields.dob || currentUser.dob,
            gender: updateFields.gender || currentUser.gender,
            _id: { $ne: req.params.id } 
        }).collation({ locale: 'en', strength: 2 });

        if (duplicateUser) {
            return next(new ErrorHandler("User already exists.", 409));
        }

        const updatedUser = await userCollection.findByIdAndUpdate(req.params.id, updateFields, { new: true });

        if (!updatedUser) {
            return next(new ErrorHandler("User not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            updatedUser
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};



// Delete a user by ID
const deleteUser = async (req, res, next) => {
    try {
        const { password } = req.body; 

        if (!password) {
            return next(new ErrorHandler("Password is required", 400));
        }

        const currentUser = await userCollection.findById(req.params.id).select('+password'); 

        if (!currentUser) {
            return next(new ErrorHandler("User not found", 404));
        }

        const isMatch = await bcrypt.compare(password, currentUser.password); 

        if (!isMatch) {
            return next(new ErrorHandler("Invalid password or Unauthorised user", 401));
        }

        await userCollection.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};


module.exports = { getUser, getAllUser, getAllGender, addUser, editUser, deleteUser };