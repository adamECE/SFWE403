const mongoose = require('mongoose')
    //  db local connection to MongoDB Compass
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
const connectDB = async() => {
    try {

        const dbConnection = await mongoose.connect(process.env.MONGO_URI, {
            sslValidate: true,
            tlsCertificateKeyFile: `${__dirname}/X509-cert-5902900897658670396.pem`,
            authMechanism: 'MONGODB-X509',
            authSource: '$external'
        });

        console.log(`MongoDB connected: ${dbConnection.connection.host}`)
    } catch (err) {
        console.log(err)
        process.exit(1)

    }
}
module.exports = connectDB