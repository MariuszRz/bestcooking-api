const express = require("express");
const app = express();

// init database
require("./db/mongoos");

const useragent = require("express-useragent");
app.use(useragent.express());


// body prser // application/x-www-form-urlencoded
app.use(express.json());

// mount routes
app.use("/api/users/", require("./routes/users"));
app.get("/", (req, res) => {
    res.json("hello");
});

module.exports = app;
