//  db local connection to MongoDB Compass
// const mongoose = require('mongoose')
// const connectDB = async() => {
//     try {
//         const dbConnection = await mongoose.connect('mongodb://127.0.0.1/Pharmacy-x02', {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         })
//         console.log(`MongoDB connected: ${dbConnection.connection.host}`)
//     } catch (err) {
//         console.log(err)
//         process.exit(1)
//     }
// }
// module.exports = connectDB

// db online connection to Atlas
const mongoose = require('mongoose')
const connectDB = async() => {
    try {
        const dbConnection = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`MongoDB connected: ${dbConnection.connection.host}`)
    } catch (err) {
        console.log(err)
        process.exit(1)

    }
}
module.exports = connectDB