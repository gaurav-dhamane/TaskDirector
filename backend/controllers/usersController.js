const User = require('../models/User');
const Note = require('../models/Note');
const Team = require('../models/Team');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// @desc Get all users
// @route GET /users
// @access Private
const getTeamUsers = async (req, res) => {
  const { username, teamId } = req.query;

  try {
    if (!teamId || !username) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const teamObj = await Team.findById(teamId).lean().exec();
    const userObj = await User.findOne({ username }).lean().exec();

    if (!teamObj || !userObj) {
      return res.status(400).json({ message: 'Team or User not found' });
    }

    const userObjectId = new mongoose.Types.ObjectId(userObj._id);

    if (!teamObj.users.some(user => user.equals(userObjectId))) {
      return res.status(401).json({ message: `Unauthorized: ${userObj._id} is not a User for ${teamObj._id}` });
    }

    const users = teamObj.users;

    if (!users.length) {
      return res.status(400).json({ message: 'No users found in the team' });
    }

    const usersDataPromises = users.map(async user => {
      return User.findById(user).exec();
    });

    const usersData = await Promise.all(usersDataPromises);

    return res.json(usersData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUserData = async (req, res,) => {
  const {userId}  = req.query;
  try {
    
    const userData = await User.findById(userId).exec()

    res.json(userData)

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

const getAllUsers = async (req, res) => {
  try {
    // Get all users from MongoDB
    const users = await User.find().select('-password').lean()

    // If no users 
    if (!users?.length) {
      return res.status(400).json({ message: 'No users found' })
    }

    res.json(users)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res, fromServer) => {
  const { username, password } = req.body;

  try {
    // Confirm data
    if (!username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate username within the team
    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec();

    if (duplicate) {
      return res.status(409).json({ message: 'Duplicate username' });
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10);

    const userObject = { username, password: hashedPwd };

    // Create and store new user
    const user = await User.create(userObject);

    if (user) {
      if (fromServer) {
        res.status(201).json({ message: `New user ${username} created` });
      }
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @desc Update user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
  const { id, username, active, password } = req.body;

  try {
    // Confirm data
    if (!id || !username || typeof active !== 'boolean') {
      return res.status(400).json({ message: 'All fields except password are required' });
    }

    const user = await User.findById(id).exec();

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec();

    // Allow updates to the original user
    if (duplicate && duplicate._id.toString() !== id) {
      return res.status(409).json({ message: 'Duplicate username' });
    }

    user.username = username;
    user.active = active;

    if (password) {
      // Hash password
      user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.username} updated` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @desc Delete user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
  const { id } = req.body;

  try {
    // Confirm data
    if (!id) {
      return res.status(400).json({ message: 'User ID Required' });
    }

    // Does the user exist to delete?
    const user = await User.findById(id).exec();

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const { username, _id } = user;

    const result = await user.deleteOne();

    const reply = `Username ${username} with ID ${_id} deleted`;

    res.json(reply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getUserData,
  getTeamUsers,
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
