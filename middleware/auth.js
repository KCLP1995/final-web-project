// middleware/auth.js

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();  // If user is logged in, proceed to the next route
    } else {
        req.flash('error', 'You must be logged in to access this page');
        res.redirect('/login');  // Redirect to login if user is not logged in
    }
}

module.exports = { isAuthenticated };
