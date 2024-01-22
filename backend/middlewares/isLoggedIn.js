const jwt = require('jsonwebtoken');

function isLoggedIn(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send({ message: 'No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Failed to authenticate token.' });
    }

    // If everything is good, save the decoded token to request for use in other routes
    req.userId = decoded.id;
    next();
  });
}

module.exports = isLoggedIn;
