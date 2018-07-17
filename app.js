//Load express module.
//The below line returns a function
const express = require('express');
//Joi class.  Used for input validation.
//We need to define a schema of the expected object structure.
const Joi = require('joi');
const log = require('./middleware/Logger');
const Authenticate = require('./Authenticate');
const helmet = require('helmet');  //Requires helmet package to be installed.
const morgan = require('morgan');  //Requires helmet package to be installed.
const config = require('config');
const courses = require('./routes/courses');
const homepage = require('./routes/home');

const startUpDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

//Configuration
console.log(`Application Name: ${config.get('name')}`);
console.log(`Mail Server: ${config.get('mail.host')}`);
console.log(`Mail Password: ${config.get('mail.password')}`);

//Returns an object of type Express
const app = express();

app.set('view engine', 'pug'); //Template engine. Express will internally load this module and doesn't require an explicit require.
app.set('views', './views');  //default.

//built in middleware function in express
app.use(express.json());//express.json() reads the body of the request and if 
                        //there parses the body if it exists into a JSON object and sets
                        //req.body property.

//Another builtin middleware funciton.                        
app.use(express.urlencoded({extended: true})); //Parses input request with body encoded like  Key=value&key=value (espescially in form inputs) and 
                               //structures them into a JSON object.

//Another builtin middleware function to serve static file.s
app.use(express.static('public'));  //Put static files like css, images in this public folder. Static content is served from the root of the site.

//Third party middleware functions.
app.use(helmet());  //Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
if (app.get('env') === 'development') {
    app.use(morgan('tiny')); //A middle ware function to log the URL requested in a tiny URL format.
    startUpDebugger('Morgan enabled...');
}

app.use('/api/courses', courses);
app.use('/', homepage);

//Db work....
dbDebugger('Connecting to the database...');

// a) Logging middleware function is called
app.use(log);

// b) Authenticating middleware function is called
app.use(Authenticate);

//Set the port in the environment
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}....`);
});



