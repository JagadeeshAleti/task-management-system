exports.authorizeRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).send('Access denied, only admin and manager can create task');
    next();
};
