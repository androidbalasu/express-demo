//Load express module.
//The below line returns a function
const express = require('express');

//Returns an object of type Express
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/courses', (req, res)=>{
    console.log('Sending back courses list');
    res.send([1, 2, 3]);
});

app.listen('3000', () => {
    console.log('Listening on port 3000....');
});