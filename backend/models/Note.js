const mongoose = require('mongoose');


const noteSchema = new mongoose.Schema(
  {

    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Team'
    }
    
  },
  {
    timestamps: true
  },
  { collection: 'notes' }
)



module.exports = mongoose.model('Note', noteSchema)