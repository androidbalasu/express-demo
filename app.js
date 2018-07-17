//Load express module.
//The below line returns a function
const express = require('express');
//Joi class.  Used for input validation.
//We need to define a schema of the expected object structure.
const Joi = require('joi');
const log = require('./Logger');
const Authenticate = require('./Authenticate');
const helmet = require('helmet');  //Requires helmet package to be installed.
const morgan = require('morgan');  //Requires helmet package to be installed.


//Returns an object of type Express
const app = express();

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
app.use(morgan('tiny')); //A middle ware function to log the URL requested in a tiny URL format.

// a) Logging middleware function is called
app.use(log);

// b) Authenticating middleware function is called
app.use(Authenticate);

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
    {id: 4, name: 'course4'},
];

app.get('/', (req, res) => {
    res.send('Welcome to our University');
});

//Endpoint to return all courses
app.get('/api/courses', (req, res)=>{
    console.log('Sending back courses list');
    res.send(courses);
});

//Endpoint to return the requested course
// /api/courses/1
app.get('/api/courses/:id', (req, res) => {
    //res.send(req.params.id);
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) // 404 object not found.
        res.status(404).send(`Course with given id $req.param.id not found`);
    else
        res.send(course);
        
});

//Endpoint to return all courses
app.post('/api/courses', (req, res) => {
    
    //Object destructuring.
    const {error} = ValidateCourse(req.body);
    
    if(error){
        //400 bad request
        return res.status(400).send(error.details[0].message);
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
});

//Set the port in the environment
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}....`);
});

//Endpoint to update a course
app.put('/api/courses/:id', (req, res)=>{
    //Look up the course with the given id.
    //If course doesn't exist, return 404,
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) // 404 object not found.
        return res.status(404).send(`Course with given id $req.param.id not found`);

    //Validate input
    //If invalid, return 400 - bad request
    const result =ValidateCourse(req.body);

    if(result.error){
        //400 bad request
        res.status(400).send(result.error.details[0].message);
        return;
    }

    //Update course
    course.name = req.body.name;
    //Return the udpated course
    res.send(course);
});

//Validate course using Joi middleware function
function ValidateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(course, schema);
}

//Endpoint to delete a course given its id
app.delete('/api/courses/:id', (req, res)=>{
    //Lookup the course.
    //Not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) // 404 object not found.
        return res.status(404).send(`Course with given id $req.param.id not found`);

    //Delete the course
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    
    //Return the deleted course.
    res.send(course);
});