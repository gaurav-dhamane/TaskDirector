const Team = require('../models/Team');
const bcrypt = require('bcrypt');
const usersController = require('../controllers/usersController')
require('dotenv').config()
// @desc Get all teams
// @route Get /teams
// @access Private
const getAllTeams = async (req, res) => {
    const { teamname } = req.body;
    if (teamname) {
        const team = await Team.findOne({ teamname }).select('-password').lean().exec();
        if (!team) {
            return res.status(400).json({ message: 'No Teams found' })
        }
        res.json(team);
    }
    //
    const teams = await Team.find().select('-password').lean();
    if (!teams?.length) {
        return res.status(400).json({ message: 'No Teams found' })
    }
    res.json(teams);
};



// @desc create new teams
// @route POST /teams
// @access Private
const createNewTeam = async (req, res) => {
    const { teamname, password, users } = req.body;

    //confirm data
    if (!teamname || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    // Check for duplicate
    const duplicate = await Team.findOne({ teamname }).collation({locale: 'en' , strength: 2}).lean().exec();
    

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate Teamname' });
    };

    //Hash password
    const hashedPwd = await bcrypt.hash(password, 10);

    const teamObject = users ? { teamname, "password" : hashedPwd, users} : { teamname, "password" : hashedPwd}

    //Create and Store new team

    const team = await Team.create(teamObject);

    if (team) {
         const s = {
            body : {
                username: `${teamname}-admin`,
                password: password,
                roles:["Admin"],
                team : team.id
            }
        }
        usersController.createNewUser(req=s)
        res.status(201).json({ message: `New team ${teamname} created` });

    } else {
        res.status(400).json({ message: 'Invalid data received' });
    }
}


// @desc update teams
// @route PATCH /teams
// @access Private
const updateTeam = async (req, res) => {
    const { id, teamname, password } = req.body;

    //Confirm data
    if (!id || !teamname ) {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    const team = await Team.findById(id).exec();

    if (!team) {
        return res.status(400).json({ message: "Team not found" })
    }

    // Check for duplicate
    const duplicate = await Team.findOne({ teamname }).collation({locale:'en', strength:2}).lean().exec();

    // Allow updates to original team
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: "Duplicate Teamname" })
    }

    team.teamname = teamname;

    if (password) {
        //Hash password
        team.password = await bcrypt.hash(password, 10)
    }

    const updatedTeam = await team.save();

    res.json({ message: `${updatedTeam.teamname} updated` })
}

// @desc delete teams
// @route DELETE /teams
// @access Private
const deleteTeam = async (req, res) => {
    const { id } = req.body;

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Team ID Required' });
    }

    // Does the team still have assigned notes?
    const note = await Note.findOne({ team: id }).lean().exec();
    if (note) {
        return res.status(400).json({ message: 'Team has assigned notes' });
    }

    // Does the team exist to delete?
    const team = await Team.findById(id).exec();

    if (!team) {
        return res.status(400).json({ message: 'Team not found' });
    }

    const { teamname, _id } = team;

    const result = await team.deleteOne();

    const reply = `Teamname ${teamname} with ID ${_id} deleted`;

    res.json(reply);
}

module.exports = {
    getAllTeams,
    createNewTeam,
    updateTeam,
    deleteTeam
}