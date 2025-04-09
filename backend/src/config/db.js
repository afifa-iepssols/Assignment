const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${connect.connection.host}, ${connect.connection.name}`);
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1); 
    }
};

module.exports = connectDB;