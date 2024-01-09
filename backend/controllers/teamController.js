const Team = require('../models/Team');
const User = require('../models/User');
const Note = require('../models/Note');
const bcrypt = require('bcrypt');

// @desc Get all teams
// @route GET /teams
// @access Private
const getAllTeams = async (req, res) => {
    const {username} = req.query;
    try {
        // Get user by username
        const user = await User.findOne({username:username}).exec();

        if (!user) {
            return res.status(400).json({ message: 'User Does not Exist' });
        }

        const teams = user.teams;

        if (!teams?.length) {
            return res.status(400).json({ message: 'No teams found' });
        }

        const teamsData = await Promise.all(
            teams.map(async (teamId) => {
                const team = await Team.findById(teamId).lean().exec();
                return team;
            })
        );

        return res.json(teamsData);
    } catch (error) {
        console.error('Error getting teams:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// @desc Create new teams
// @route POST /teams
// @access Private
const createNewTeam = async (req, res) => {
    try {
        const { teamname, adminId, users } = req.body;

        // Confirm data
        if (!teamname || !adminId) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if adminId is a valid user
        const adminUser = await User.findOne({ _id: adminId }).collation({ locale: 'en', strength: 2 }).lean().exec();

        if (!adminUser) {
            return res.status(400).json({ message: 'Invalid adminId. User does not exist' });
        }

        // Check for duplicate teamname
        const duplicate = await Team.findOne({ teamname }).collation({ locale: 'en', strength: 2 }).lean().exec();

        if (duplicate) {
            return res.status(409).json({ message: 'Duplicate Teamname' });
        }

        const usersList = [adminId];

        if (users) {
            // Validate users and add them to usersList
            await Promise.all(
                users.map(async (user) => {
                    const validUser = await User.findOne({ _id: user }).collation({ locale: 'en', strength: 2 }).lean().exec();
                    if (!validUser) {
                        return res.status(400).json({ message: `User with ID ${user} does not exist` });
                    }
                    const userObj = await User.findById(user).exec();
                    usersList.push(userObj.id);
                })
            );
        }

        const teamObject = { teamname, creator: adminId, admins: [adminId], users: [...usersList] };

        // Create and store a new team
        const team = await Team.create(teamObject);

        // Update users with the new team ID
        await Promise.all(
            usersList.map(async (userId) => {
                const validUser = await User.findOne({ _id: userId }).collation({ locale: 'en', strength: 2 }).lean().exec();
                if (!validUser) {
                    // Log the error, but do not send a response here
                    console.error(`User with ID ${userId} does not exist`);
                } else {
                    const userObj = await User.findById(userId).exec();
                    userObj.teams = [...userObj.teams, team.id];
                    await userObj.save();
                }
            })
        );

        const userObj = await User.findById(adminId).exec();
        userObj.admin_teams.push(team.id);
        await userObj.save()

        return res.status(201).json({ message: `New team ${teamname} created` });
    } catch (error) {
        console.error('Error creating team:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// @desc Update teams
// @route PATCH /teams
// @access Private
const updateTeam = async (req, res) => {
    let { id, teamname, addAdmin, addUser, removeAdmin, removeUser } = req.body;

    
    // Confirm data
    if (!id  ) {
        return res.status(400).json({ message: 'team Id required' });
    }

    try {
        const team = await Team.findById(id).exec();

        

        if (!team) {
            return res.status(400).json({ message: "Team Not Found" });
        }

        if(!teamname){
            teamname = team.teamname
        }
        // Check for duplicate
        const duplicate = await Team.findOne({ teamname }).collation({ locale: 'en', strength: 2 }).lean().exec();

        // Allow updates to the original team
        if (duplicate && duplicate?._id.toString() !== id) {
            return res.status(409).json({ message: "Duplicate Teamname" });
        }

        if (addAdmin) {

            const user = await User.findById(addAdmin).exec()
            if (!user) {
                return res.status(400).json({ message: "User not found" })
            }

            team.admins = [...team.admins, addAdmin];
            team.users.push(addAdmin)

            user.admin_teams.push(team._id)
            user.teams.push(team._id)
            await user.save()
        }
        if (addUser) {
            const user = await User.findById(addUser).exec()
            if (!user) {
                return res.status(400).json({ message: "User not found" })
            }
            team.users.push(addUser)

            user.teams.push(team._id)
            await user.save()
        }

        if (removeAdmin) {
            // Remove admin from team
            team.admins = team.admins.filter(adminId => adminId.toString() !== removeAdmin);

            // Remove team from user's admin_teams list
            const user = await User.findById(removeAdmin).exec();
            if (user) {
                user.admin_teams = user.admin_teams.filter(teamId => teamId.toString() !== team._id.toString());
                await user.save();
            }
        }

        if (removeUser) {
            // Remove user from team
            team.users = team.users.filter(userId => userId.toString() !== removeUser);

            // Remove team from user's teams list
            const user = await User.findById(removeUser).exec();
            if (user) {
                user.teams = user.teams.filter(teamId => teamId.toString() !== team._id.toString());
                await user.save();
            }
        }

        team.teamname = teamname;

        const updatedTeam = await team.save();

        res.json({ message: `${updatedTeam.teamname} updated` });
    } catch (error) {
        console.error('Error updating team:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// @desc Delete teams
// @route DELETE /teams
// @access Private
const deleteTeam = async (req, res) => {
    const { id , userId} = req.body;
    try {
        // Confirm data
        if (!id && !userId) {
            return res.status(400).json({ message: 'All fields Required' });
        }

        const team = await Team.findById(id).exec();

        if(userId !== team.creator.toString()){
            return res.status(401).json({message: "Unauthorized"})
        }

        // Does the team still have assigned notes?
        const note = await Note.findOne({ team: id }).lean().exec();
        if (note) {
            return res.status(400).json({ message: 'Team has assigned notes' });
        }
        
        

        // Does the team exist to delete?
        

        if (!team) {
            return res.status(400).json({ message: 'Team Not Found' });
        }

        team.users.map(async (userId) => {
            try {
                const newUser = await User.findById(userId).exec();
        
                // Remove the team id from newUser.teams
                newUser.teams = newUser.teams.filter((teamId) => teamId.toString() !== id);
        
                // Save the updated user
                await newUser.save();
            } catch (error) {
                console.error('Error updating user:', error);
            }
        });
        


        const { teamname, _id } = team;

        const result = await team.deleteOne();

        const reply = `Teamname ${teamname} with ID ${_id} deleted`;

        res.json(reply);
    } catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getAllTeams,
    createNewTeam,
    updateTeam,
    deleteTeam,
};
