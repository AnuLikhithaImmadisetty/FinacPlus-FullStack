const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const c = await mongoose.connect(process.env.DB_URI);
        console.log(`Database connected with ${c.connection.host}`)
    } catch (error) {
        console.error(error.message);
        console.log("Database not connected")
    }
}

module.exports = connectDB;