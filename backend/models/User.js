const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    active: {
        type: Boolean,
        default: true
    },
    admin_teams: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'Team'
    },
    teams: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'Team'
    },
    notes: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'Note'
    }
},
    { collection: 'users' }
)

module.exports = mongoose.model('User', userSchema)