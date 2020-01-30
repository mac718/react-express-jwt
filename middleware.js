const jwt = require('jsonwebtoken');
const secret = 'mysecretsshhh';

const withAuth = function(req, res, next) {
  const token = req.cookies.token;

  if(!token) {
    res.status(401).send("Unauthorized: no token")
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if(err) {
        res.status(401).send("Unauthorized: no token")  
      } else {
        req.email = decoded.email;
        next();
      }
    })
  }
}

module.exports = withAuth;