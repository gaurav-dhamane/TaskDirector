const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        default: ["Employee"]
    },
    active: {
        type: Boolean,
        default: true
    },
    notes: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'Note'
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Team'
    }
},
{ collection: 'users' }
)

module.exports = mongoose.model('User', userSchema)