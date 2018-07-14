//Create a custom middleware function

// a) Logging middleware function is called
function log (req, res, next) {
    console.log('Logging ....');
    next();  //If next middleware function in the pipieline is not called and there is no response, then the request is left hanging.
}

//Middleware functions are called in sequence.

module.exports = log;