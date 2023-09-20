const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const morgan = require('morgan')
const createError = require('http-errors')
const authRoutes = require('./routes/auth')
dotenv.config({ path: './config/.env' })
const app = express();
const PORT = process.env.PORT || 8080;

//db connection
connectDB()
    // This is to enable cross-origin access
app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.use(morgan('dev')); // Enable HTTP request logging with the 'dev' format
app.use(express.json()); // Parse incoming JSON data
app.use(express.urlencoded({ extended: false })); // Parse incoming URL-encoded data with extended mode disabled
app.use(cookieParser()); // Parse and manage cookies


//loading routers
app.use('/', (req, res) => {
    res.send({ 'message': " express server running" })
});
//app.use('/api/new-user', authRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500)
    res.render('error')
});

app.listen(PORT, () => {
    console.log(`Server running at PORT ${PORT}`);
});