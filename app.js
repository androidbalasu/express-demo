//Load express module.
//The below line returns a function
const express = require('express');
//Joi class.  Used for input validation.
//We need to define a schema of the expected object structure.
const Joi = require('joi');

//Returns an object of type Express
const app = express();
app.use(express.json());

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
    {id: 4, name: 'course4'},
];

app.get('/', (req, res) => {
    res.send('Hello World');
});

//Endpoint to return all courses
app.get('/api/courses', (req, res)=>{
    console.log('Sending back courses list');
    res.send(courses);
});

//Endpoint to return the request course
// /api/courses/1
app.get('/api/courses/:id', (req, res) => {
    //res.send(req.params.id);
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) // 404 object not found.
        res.status(404).send(`Course with given id $req.param.id not found`);
    else
        res.send(course);
        
});

// app.get('/api/posts/:month/:year', (req, res) => {
//     res.send(req.params);
// });

app.get('/api/posts/:month/:year', (req, res) => {
    res.send(req.query);
});


app.post('/api/courses', (req, res) => {
    const schema = {
        name: Joi.string().min(3).required()
    }

    const result = Joi.validate(req.body, schema);
    
    if(result.error){
        //400 bad request
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}....`);
});