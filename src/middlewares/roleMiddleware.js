// This function takes an array of allowed roles and returns a middleware function
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user is set by the 'protect' middleware. If it's missing, or the role isn't allowed:
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: `Access denied. Role '${req.user ? req.user.role : 'unknown'}' is not authorized to access this route.` 
            });
        }
        next();
    };
};

module.exports = { authorize };