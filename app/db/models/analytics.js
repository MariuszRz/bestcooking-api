const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const analyticsSchema = new Schema({
    path: {
        type: String,
        unigue: true,
        trim: true
    },
    views: {
        type: Number,
        default: 0,
    },
})

const Analytics = mongoose.model("Analytics", analyticsSchema);

module.exports = Analytics;