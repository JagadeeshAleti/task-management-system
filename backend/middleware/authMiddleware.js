const jwt = require('jsonwebtoken');

exports.authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).send('Access denied, token required');
    
    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.status(403).send('Invalid token');
        req.user = user;
        console.log("Token verified successully!!!!");
        next();
    });
};
