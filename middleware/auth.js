// middleware/auth.js

function checkAuthenticated(req, res, next) {
    if (req.session.user) {
        return next(); // If user is logged in, proceed to the next middleware or route handler
    }
    res.redirect('/user/login'); // Redirect to login if not authenticated
}

function checkNotAuthenticated(req, res, next) {
    if (req.session.user) {
        return res.redirect('/index/index'); // Redirect to dashboard if already logged in
    }
    next(); // Otherwise, proceed to the next middleware
}

// Middleware to check if the user is an admin
function checkAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        return next(); // If the user is admin, proceed to the next middleware or route handler
    }
    res.redirect('/index'); // If not admin, redirect to the user dashboard
}

module.exports = { checkAuthenticated, checkNotAuthenticated, checkAdmin };
