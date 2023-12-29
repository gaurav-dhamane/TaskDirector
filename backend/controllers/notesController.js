const Note = require('../models/Note')
const User = require('../models/User')
const Team = require('../models/Team');
const mongoose = require('mongoose')


// @desc Get all notes 
// @route GET /notes
// @access Private
const getAllNotes = async (req, res) => {
  const { teamId, userId } = req.query
  try {
    // Find the teama document by teamId
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team Not Found"});
    }

    // Get the note IDs associated with the team
    const noteIds = team.notes || [];

    // Find the notes based on the note IDs
    const notes = await Note.find({ _id: { $in: noteIds } }).lean();

    if (!notes?.length) {
      return res.status(400).json({ message: 'No notes found for the team' });
    }

    // Add username to each note before sending the response
    const notesWithUser = await Promise.all(notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    }));

    res.json(notesWithUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = async (req, res) => {
  const { user, title, text } = req.body;

  // Confirm data
  if (!user || !title || !text) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check for duplicate title within the team
  const duplicate = await Note.findOne({ title, user }).collation({ locale: 'en', strength: 2 }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate note title' });
  }

  // Create and store the new note
  const newNote = new Note({
    user,
    title,
    text,
    ticket: null, // Explicitly set to null to trigger auto-increment logic
  });

  try {
    await newNote.save();
    // save in user model
    const userObj = await User.findById(user).exec();
    userObj.notes = [...userObj.notes, newNote.id];
    await userObj.save();

    // save in team
    const teamObj = await Team.findById(userObj.team).exec();
    teamObj.notes = [...teamObj.notes, newNote.id];
    await teamObj.save();

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

  const { id, user, title, text, completed } = req.body

  // Confirm data
  if (!id || !user || !title || !text || typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Confirm note exists to update
  const note = await Note.findById(id).exec()

  if (!note) {
    return res.status(400).json({ message: 'Note not found' })
  }

  // Check for duplicate title
  const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

  // Allow renaming of the original note 
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate note title' })
  }

  if (!mongoose.Types.ObjectId.isValid(user) || user.toString() !== note.user.toString()) {
    const oldUserObj = await User.findById(note.user).exec();
    const newUserObj = await User.findById(user).exec();

    // check if new user belongs to same team
    if(!newUserObj.team.equals(oldUserObj.team)){
      return res.status(403).json({ message: 'User not found' })
    }


    // Remove note ID from the old user's notes list
    oldUserObj.notes = oldUserObj.notes.filter(noteId => noteId.toString() !== id);
    await oldUserObj.save();

    // Add note ID to the new user's notes list
    newUserObj.notes = [...newUserObj.notes, id];
    await newUserObj.save();


  }

  note.user = user
  note.title = title
  note.text = text
  note.completed = completed

  const updatedNote = await note.save()

  res.json(`'${updatedNote.title}' updated`)
}

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = async (req, res) => {
  const { id } = req.body

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: 'Note ID required' })
  }

  // Confirm note exists to delete 
  const note = await Note.findById(id).exec()

  if (!note) {
    return res.status(400).json({ message: 'Note not found' })
  }

  const deletedTitle = note.title

  await note.deleteOne()

  const reply = `Note '${deletedTitle}' with ID ${id} deleted`

  res.json(reply)
}

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote
}