//Load express module.
//The below line returns a function
const express = require('express');

//Returns an object of type Express
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen('3000', () => {
    console.log('Listening on port 3000....');
});