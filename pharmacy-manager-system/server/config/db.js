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
const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');
const credentials = '.'



const connectDB = async() => {
    try {

        const client = await mongoose.connect('mongodb+srv://cluster0.vricux2.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', {

            sslValidate: true,
            tlsCertificateKeyFile: `${__dirname}/X509-cert-5902900897658670396.pem`,
            authMechanism: 'MONGODB-X509',
            authSource: '$external'
        });

        //await client.connect()
        console.log(`MongoDB connected:`)
    } catch (err) {
        console.log(err)
        process.exit(1)

    }
}
module.exports = connectDB