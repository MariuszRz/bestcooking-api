const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const { validateEmail } = require("../validators");
// model
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Pole name jest wymagane"],
        minLength: [3, "Minimalna liczba znaków to 3"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Pole email jest wymagane"],
        minLength: [6, "Minimalna liczba znaków to 3"],
        validate: [
            (value) => validateEmail(value),
            "Adres email jest nie prawidłowy",
        ],
        trim: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Pole hasło jest wymagane"],
    },
    avatar: String,
    isAdmin: {
        type: Number,
        min: 0,
        max: 1,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    refreshToken: [{
        device: String,
        token: String,
        loginAt: {
            type: Date,
            default: Date.now,
        }
    }],
});

userSchema.pre("save", function (next) {
    const user = this;
    if (!this.isModified("password")) return next();
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
    next();
});

userSchema.post("save", function (error, doc, next) {
    if (error.name === "MongoError" && error.code === 11000) {
        error.errors = { email: { message: "Podany adres już istnieje" } };
    }
    next();
});
userSchema.methods = {
    comparePassword(password) {
        return bcrypt.compareSync(password, this.password);
    },
};

const User = mongoose.model("User", userSchema);

module.exports = User;
