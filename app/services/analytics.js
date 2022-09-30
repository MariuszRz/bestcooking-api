const Analytics = require("../db/models/analytics");

module.exports = async function (req, res, next) {
    const path = req.path;
    await Analytics.updateOne({ path: path }, { $inc: { views: 1 } }, { upsert: true });
    next();
};