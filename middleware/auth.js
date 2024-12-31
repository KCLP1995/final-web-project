// middleware/auth.js
function checkAuthenticated(req, res, next) {
    if (req.session.user) {
        return next(); // If user is logged in, allow access
    }
    res.redirect('/user/login'); // Redirect to login if not authenticated
}

function checkNotAuthenticated(req, res, next) {
    if (req.session.user) {
        return res.redirect('/user/dashboard'); // If logged in, redirect to dashboard
    }
    next(); // Otherwise, proceed to the next middleware
}

module.exports = { checkAuthenticated, checkNotAuthenticated };
