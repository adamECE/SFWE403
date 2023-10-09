const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const morgan = require("morgan");
const createError = require("http-errors");
const authRoutes = require("./routes/auth");
const logger = require("./middleware/logger");
const cors = require('cors');
dotenv.config({ path: "./config/.env" });
const app = express();
const PORT = process.env.PORT || 8080;

//db connection
connectDB();
const allowedOrigins = ['http://localhost:3000']; // Add your frontend URL here

const allowedHeaders = [
    'Authorization',
    'authorization',
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Accept-Language',
    'Content-Language', // Add other required headers here
];


app.use(
    cors({
        origin: function(origin, callback) {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: allowedHeaders,
        credentials: true,
    })
);


app.use(morgan("dev")); // Enable HTTP request logging with the 'dev' format
app.use(express.json()); // Parse incoming JSON data
app.use(express.urlencoded({ extended: false })); // Parse incoming URL-encoded data with extended mode disabled
app.use(cookieParser()); // Parse and manage cookies

//app.use(logger);

//loading routers
// app.use('/', (req, res) => {
//     res.send({ 'message': " express server running" })
// });
app.use("/pharmacy-0x2/api/", authRoutes);
app.use("/pharmacy-0x2/api/inventory/", require("./routes/inventory"));
app.use("/pharmacy-0x2/api/patientHistory/", require("./routes/patientHistory"));
app.use("/pharmacy-0x2/api/activityLog/", require("./routes/activityLog"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

app.listen(PORT, () => {
    console.log(`Server running at PORT ${PORT}`);
});