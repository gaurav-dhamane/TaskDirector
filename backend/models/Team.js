const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamname: {
        type: String,
        unique: true,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    admins:{
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref:'User'
    },
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'User'
    },
    notes: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'Note'
    },
    

},
{ collection: 'teams' }
)

module.exports = mongoose.model("Team", teamSchema)