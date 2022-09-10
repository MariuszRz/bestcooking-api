require("dotenv").config();

module.exports = {
    port: process.env.PORT || 80,
    database: process.env.DATABASE,
    sessionKey: process.env.SESSION_KEY,
    accessToken: process.env.ACCESS_TOKEN,
    refreshToken: process.env.REFRESH_TOKEN,
};
