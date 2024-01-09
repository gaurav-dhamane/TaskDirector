const Note = require('../models/Note');
const User = require('../models/User');
const Team = require('../models/Team');
const mongoose = require('mongoose');

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = async (req, res) => {
  const { teamId} = req.query;

  try {
    // Find the team document by teamId
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team Not Found' });
    }

    // Get the note IDs associated with the team
    const noteIds = team.notes || [];

    // Find the notes based on the note IDs
    const notes = await Note.find({ _id: { $in: noteIds } }).lean();

    if (!notes?.length) {
      return res.status(400).json({ message: 'No notes found for the team' });
    }

    // Add username to each note before sending the response
    const notesWithUser = await Promise.all(
      notes.map(async (note) => {
        const user = await User.findById(note.assigned_to).lean().exec();
        return { ...note, username: user.username };
      })
    );

    res.json(notesWithUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// @desc Get user notes
// @route GET /notes/user-notes
// @access Private
const getUserNotes =async (req, res) => {
  const {userId} = req.query;
  try {
    const user = await User.findById(userId).exec()

    if (!user) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    const noteIds = user.notes || [];

     // Find the notes based on the note IDs
     const notes = await Note.find({ _id: { $in: noteIds } }).lean();

     if (!notes?.length) {
       return res.status(400).json({ message: 'No notes found' });
     }
 
     // Add username to each note before sending the response
     const notesWithUser = await Promise.all(
       notes.map(async (note) => {
         const user = await User.findById(userId).lean().exec();
         return { ...note, username: user.username };
       })
     );
 
     res.json(notesWithUser);

  }catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = async (req, res) => {
  const {title, text, creator, assigned_to, team } = req.body;

  // Confirm data
  if (!title || !text || !creator || !assigned_to || !team) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {

    // Check if user and team exist
    const validCreator = await User.findById(creator).exec();
    const validUser = await User.findById(assigned_to ).exec();
    const validTeam = await Team.findById(team).exec();

    if (!validUser || !validTeam || !validCreator) {
      return res.status(400).json({ message: 'User or Team does not exist' });
    }

    // check if creator and assigned_to are part of team
    if (!validTeam.users.includes(creator) || !validTeam.users.includes(assigned_to)) {
      return res.status(400).json({ message: 'Creator or assigned user is not part of the specified team' });
    }
    

    // Create and store the new note
    const newNote = new Note({
      title,
      text,
      creator,
      assigned_to,
      team
    });

    await newNote.save();

    validTeam.users.map(async userId =>{
      const founduser = await User.findById(userId).exec();
      founduser.notes= [...founduser.notes, newNote.id];
      await founduser.save()
    })

    // Save in team
    validTeam.notes = [...validTeam.notes, newNote.id];
    await validTeam.save();

    return res.status(201).json({ message: 'New note created' });
  } catch (error) {
    console.error('Error creating note:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNote = async (req, res) => {
  const { id, assigned_to, title, text, completed } = req.body;

  // Confirm data
  if (!id || !assigned_to || !title || !text || typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'All fields are required' });
  } 

  try {
    // Confirm note exists to update
    const note = await Note.findById(id).exec();

    if (!note) {
      return res.status(400).json({ message: 'Note not found' });
    }

    


    if (!mongoose.Types.ObjectId.isValid(assigned_to) || assigned_to.toString() !== note.assigned_to.toString()) {
      const oldUserObj = await User.findById(note.assigned_to).exec();
      const newUserObj = await User.findById(assigned_to).exec();

      const team = await Team.findById(note.team).exec()

      if(!(team.users.includes(assigned_to))){
        return res.status(400).json({ message: 'Assigned user does not exist in team' });
      }


      // Remove note ID from the old user's notes list
      oldUserObj.notes = oldUserObj.notes.filter((noteId) => noteId.toString() !== id);
      await oldUserObj.save();

      // Add note ID to the new user's notes list
      newUserObj.notes = [...newUserObj.notes, id];
      await newUserObj.save();
    }

    note.assigned_to = assigned_to;
    note.title = title;
    note.text = text;
    note.completed = completed;

    const updatedNote = await note.save();

    res.json(`${updatedNote.title} updated`);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = async (req, res) => {
  const { id, userId } = req.body;
  console.log(userId)
  // Confirm data
  if (!id && userId) {
    return res.status(400).json({ message: 'All fields required' });
  }

  try {
    // Confirm note exists to delete
    const note = await Note.findById(id).exec();

    if (!note) {
      return res.status(400).json({ message: 'Note not found' });
    }

    if(userId !== note.creator.toString()){
      return res.status(401).json({message: "Unauthorized"})
    }

    // remove noteId from team
    const team = await Team.findById(note.team).exec()
    const noteList =[]
    team.notes.map(noteId => {
      if(noteId.toString() != id.toString()){
        noteList.push(noteId)
      }
    })

    team.notes = noteList
    team.save()


    


    const deletedTitle = note.title;

    await note.deleteOne();

    const reply = `Note '${deletedTitle}' with ID ${id} deleted`;

    res.json(reply);
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllNotes,
  getUserNotes,
  createNewNote,
  updateNote,
  deleteNote,
};
