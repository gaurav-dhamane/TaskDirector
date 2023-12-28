const User = require('../models/User');
const Note = require('../models/Note');

const Team = require('../models/Team');
const bcrypt = require('bcrypt');


// @desc Get all users
// @route Get /users
// @access Private
const getAllUsers = async (req, res) => {
  const { teamId } = req.query;

  try {
    if (!teamId) {
      return res.status(400).json({ message: 'Team ID is required' });
    }

    const teamObj = await Team.findById(teamId).populate('users', '-password').lean().exec();

    if (!teamObj) {
      return res.status(400).json({ message: 'Team not found' });
    }

    const users = teamObj.users;

    if (!users.length) {
      return res.status(400).json({ message: 'No users found in the team' });
    }

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



// @desc create new users
// @route POST /users
// @access Private
const createNewUser = async (req, res, fromServer) => {
  const { username, password, roles, team } = req.body;

  // Confirm data
  if (!username || !password || !team) {
    return res.status(400).json({ message: 'All fields are required' });
  }


  // Check for duplicate username within the team
  const duplicate = await User.findOne({ username, team }).collation({ locale: 'en', strength: 2 }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate username within the team' });
  }

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10);

  const userObject = (!Array.isArray(roles) || !roles.length)
    ? { username, password: hashedPwd, team }
    : { username, password: hashedPwd, roles, team };

  // Create and store new user
  const user = await User.create(userObject);

  // Add user to the team
  const teamObj = await Team.findById(team).exec();
  teamObj.users = [...teamObj.users, user.id];
  await teamObj.save();

  if (user) {
    if(fromServer){
      res.status(201).json({ message: `New user ${username} created` });
    }
    
  } else {
    res.status(400).json({ message: 'Invalid user data received' });
  }
};


// @desc update users
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
  const { id, username, roles, active, password, team } = req.body;

  //Confirm data
  if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
    return res.status(400).json({ message: 'All fields except password are required' })
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" })
  }

  // Check for duplicate
  const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec();

  // Allow updates to original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" })
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    //Hash password
    user.password = await bcrypt.hash(password, 10)
  }


  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated` })
}

// @desc delete users
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: 'User ID Required' });
  }

  // Does the user still have assigned notes?
  const note = await Note.findOne({ user: id }).lean().exec();
  if (note) {
    return res.status(400).json({ message: 'User has assigned notes' });
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
}

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser
}