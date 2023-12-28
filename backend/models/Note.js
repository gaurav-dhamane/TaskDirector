const mongoose = require('mongoose');


const noteSchema = new mongoose.Schema(
    {
        ticket: {
            type: Number, // Assuming ticket is a number
          },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
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
    },
    {
        timestamps: true
    },
    { collection: 'notes' }
)

noteSchema.pre('save', async function (next) {
    try {
      if (!this.ticket) {
        const lastNote = await this.constructor.findOne({}, {}, { sort: { ticket: -1 } });
        const newTicket = (lastNote && lastNote.ticket + 1) || 1000;
        this.ticket = newTicket;
      }
      next();
    } catch (error) {
      next(error);
    }
  });

module.exports = mongoose.model('Note', noteSchema)