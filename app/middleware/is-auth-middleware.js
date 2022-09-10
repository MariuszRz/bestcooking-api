module.exports = function (req, res, next) {
    if (!req.session.user) {
        res.redirect("/logowanie");
    }
    next();
};
