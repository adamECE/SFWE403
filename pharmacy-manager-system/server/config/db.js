//this fils has the code for the db connection
import mongoose from 'mongoose'
export const connectDB = async() => {
    try {
        const dbConnection = await mongoose.connect('mongodb://127.0.0.1/Pharmacy-x02', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`MongoDB connected: ${dbConnection.connection.host}`)
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}