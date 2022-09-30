const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const clearPL = require("../../middleware/clearPL")
// model
const recipeSchema = new Schema({
    name: {
        type: String,
        minLength: [3, "Minimalna liczba znaków to 3"],
        required: [true, "Pole name jest wymagane"],
        trim: true,
        unique: true,
    },
    slag: {
        type: String,
        minLength: [3, "Minimalna liczba znaków to 3"],
        trim: true,
        lowercase: true,
        unique: true,
    },
    preparation: String,
    thumbnail: String,
    images: [{ image: String, thumb: String }],
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    category: Array,
    rating: {
        type: Number,
        default: 0,
    },
    isPublish: {
        type: Number,
        min: 0,
        max: 1,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    editedAt: {
        type: Date,
        default: Date.now,
    },
    ingredient: [{ name: String, count: String }]



});

recipeSchema.pre("save", function (next) {
    const recipe = this;
    recipe.slag = clearPL(recipe.name);
    next();
});


const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
