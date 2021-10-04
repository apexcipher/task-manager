const express = require('express');
const cookieParser = require("cookie-parser");

const bodyParser = require('body-parser');
var session = require('express-session');

// create express app
const app = express();

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser());

// Setup server port
const port = process.env.PORT || 5000;

/*
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())
// define a root route
app.get('/', (req, res) => {
  res.send("Hello World");
});
// Require employee routes
const employeeRoutes = require('./src/routes/employee.routes')
// using as middleware
app.use('/api/v1/employees', employeeRoutes)
*/

// session 
app.use(session({ 
  secret: '123456cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
app.use(express.static(__dirname + '/assets'));

// Set view engine as EJS
app.set('views', 'src/views');
app.set('view engine', 'ejs');

// var requestTime = function (req, res, next) {
//   console.log('req', req.url);
//   console.log('res', res.session);
//     if(!req.session.loggedinUser){
//       if (req.url == '/register' || req.url == '/login') {
//         res.redirect(req.url);
//         next();
//       }
//     }
//     next();
// }
// app.use(requestTime);

// takes us to the root(/) URL
var registrationRouter = require('./src/routes/registration-route');
var loginRouter = require('./src/routes/login-route');
var dashboardRouter = require('./src/routes/dashboard-route');
var bucketRouter = require('./src/routes/bucket-route');
var taskRouter = require('./src/routes/tasks-route');
var logoutRouter = require('./src/routes/logout-route');

app.use('/', registrationRouter);
app.use('/', loginRouter);
app.use('/', dashboardRouter);
app.use('/', bucketRouter);
app.use('/', taskRouter);
app.use('/', logoutRouter);

// the server is listening on port for connections
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});