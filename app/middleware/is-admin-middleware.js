module.exports = function (req, res, next) {
    if (req.user.isAdmin !== 1) return res.sendStatus(401);
    next();
};
