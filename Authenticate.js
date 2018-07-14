// b) Authenticating middleware function is called
function Authenticate(req, res, next) {
    console.log('Authenticating ....');
    next();  //If next middleware function in the pipieline is not called and there is no response, then the request is left hanging.
}


module.exports = Authenticate;