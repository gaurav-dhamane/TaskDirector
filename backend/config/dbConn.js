const mongoose = require('mongoose');
const connectDB = async (dbUri) => {
    try {
        await mongoose.connect(dbUri);
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};





module.exports = connectDB
