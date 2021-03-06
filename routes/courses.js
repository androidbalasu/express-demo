const express = require('express');
const router = express.Router(); 

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
    {id: 4, name: 'course4'},
];

//Endpoint to return all courses
router.get('/', (req, res)=>{
    console.log('Sending back courses list');
    res.send(courses);
});

//Endpoint to return the requested course
// /api/courses/1
router.get('/:id', (req, res) => {
    //res.send(req.params.id);
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) // 404 object not found.
        res.status(404).send(`Course with given id $req.param.id not found`);
    else
        res.send(course);
        
});

//Endpoint to return all courses
router.post('/', (req, res) => {
    
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


//Endpoint to update a course
router.put('/:id', (req, res)=>{
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
router.delete('/:id', (req, res)=>{
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

module.exports = router;