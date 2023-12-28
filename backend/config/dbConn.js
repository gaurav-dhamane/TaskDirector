const mongoose = require('mongoose');
const connectDB = async (dbUri) => {
    try {
        await mongoose.connect(dbUri);
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};




const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (err) {
        console.error('Error disconnecting from MongoDB:', err);
    }
};

module.exports = connectDB
