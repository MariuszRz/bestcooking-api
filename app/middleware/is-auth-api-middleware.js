const config = require("../config");
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) return res.sendStatus(401);
    jwt.verify(token, config.accessToken, (err, data) => {
        if (err) return res.sendStatus(401);
        req.user = data;
        next();
    });
};
