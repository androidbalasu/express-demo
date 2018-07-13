//Load express module.
//The below line returns a function
const express = require('express');

//Returns an object of type Express
const app = express();

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
    res.send([1, 2, 3]);
});

//Endpoint to return the request course
// /api/courses/1
app.get('/api/courses/:id', (req, res) => {
    res.send(req.params.id);
});

// app.get('/api/posts/:month/:year', (req, res) => {
//     res.send(req.params);
// });

app.get('/api/posts/:month/:year', (req, res) => {
    res.send(req.query);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}....`);
});