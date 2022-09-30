const Recipe = require("../db/models/recipe");
const fs = require("fs");
const path = require("path");


class RecipeController {
    // POBIERANIE ARTYKUŁU RAZEM Z POZOSTAŁYMI LINKAMI

    // TWORZENIE
    async create(req, res) {
        const { name, ingredient, preparation } = req.body;
        const recipe = new Recipe({
            name: name,
            ingredient: ingredient,
            preparation: preparation,
            user: req.user.id,
        });
        try {
            await recipe.save();
            res.status(201).json(recipe);
        } catch (e) {
            res.status(422).json({ errors: "Coś poszło nie tak", message: e });
        }
    }


    async addLike(req, res) {
        const { slag } = req.params;
        try {
            await Recipe.updateOne({ slag: slag }, { $inc: { rating: 1 } });
            res.status(200).json({ 'rating': 'add' });
        } catch (e) {
            res.status(422).json({ errors: "Coś poszło nie tak" });
        }
    }

    async removeLike(req, res) {
        const { slag } = req.params;
        try {
            await Recipe.updateOne({ slag: slag }, { $inc: { rating: -1 } });
            res.status(200).json({ 'rating': 'add' });
        } catch (e) {
            res.status(422).json({ errors: "Coś poszło nie tak" });
        }
    }

    async showOne(req, res) {
        const { slag } = req.params;
        try {
            // await Recipe.updateOne({ slag: slag });
            const recipe = await Recipe.findOneAndUpdate({ slag: slag }, { $inc: { views: 1 } });
            if (recipe !== null) {

                res.json(recipe)
            }
            else {
                res.status(422).json({ errors: "Coś poszło nie tak" })
            }
        } catch (e) {
            console.log(e.message);
            res.status(422).json({ errors: "Coś poszło nie tak" });
        }
    }

    async showAll(req, res) {
        try {
            const recipe = await Recipe.find({});
            if (recipe !== null) {
                res.json(recipe)
            }
            else {
                res.status(422).json({ errors: "Coś poszło nie tak" })
            }
        } catch (e) {
            console.log(e.message);
            res.status(422).json({ errors: "Coś poszło nie tak" });
        }
    }

    async ingredientAdd(req, res) {
        const { id } = req.params;
        const { name, count } = req.body;
        try {
            const recipe = await Recipe.updateOne({ "_id": id },
                { "$push": { "ingredient": { name: name, count: count } } }

            );
            res.json(recipe)
        } catch (e) {
            res.status(422).json({ errors: "Coś poszło nie tak" });
        }
    }

    async ingredientDelete(req, res) {
        const { id } = req.params;
        const { ingredientId } = req.body;
        try {
            const recipe = await Recipe.updateOne({ "_id": id },
                { "$pull": { "ingredient": { "_id": ingredientId } } }

            );
            res.json(recipe)
        } catch (e) {
            res.status(422).json({ errors: "Coś poszło nie tak" });
        }
    }

    //USUWANIE
    async delete(req, res) {
        const { id } = req.params;
        try {
            const recipe = await Recipe.findById(id);
            const images = recipe.images;
            if (images.length > 0) {
                images.forEach((image) => {
                    fs.unlinkSync("public" + image.image);
                    // fs.unlinkSync("public" + image.thumb);
                });
            }
            if (!fs.existsSync("public/images/" + id)) {
                fs.rmdirSync("public/images/" + id);
            }

            await Recipe.findByIdAndDelete(id);
            res.sendStatus(204);
        } catch (e) {
            res.status(422).json({ errors: "Coś poszło nie tak" });
        }
    }

    //EDYCJA
    async edit(req, res) {
        const { id } = req.params;
        const { name, preparation, isPublish } = req.body;

        try {
            const recipe = await Recipe.findById(id);

            if (req.file) {
                const { filename } = req.file;
                const dir = path.join("public/images/", recipe.id);
                const dirHtml = "/images/" + recipe.id + "/";
                const src = path.join("public/images/temp", filename);
                const dest = path.join(dir, filename);
                if (!fs.existsSync(dir)) fs.mkdirSync(dir);
                fs.copyFileSync(src, dest);
                fs.unlinkSync(src);
                recipe.images.push({
                    image: dirHtml + filename,
                    thumb: dirHtml + filename,
                });
            }

            if (name) recipe.name = name;
            if (preparation) recipe.preparation = preparation;
            if (isPublish) recipe.isPublish = isPublish;

            await recipe.save();
            res.status(200).json(recipe);
        } catch (e) {
            res.status(422).json({
                errors: "Coś poszło nie tak",
                error: e.message,
            });
        }
    }

    // USUWANIE ZDJĘCIA
    async deleteImg(req, res) {
        const { id, img } = req.params;

        try {
            const recipe = await Recipe.findById(id);
            let images = recipe.images;
            const image = images.filter((i) => i._id == img);
            fs.unlinkSync("public" + image[0].image);
            images = images.filter((i) => i._id != img);
            if (images.length === 0) {
                fs.rmdirSync("public/images/" + id);
            }

            recipe.images = images;
            await recipe.save();
            res.status(200).json(recipe.images);
        } catch (e) {
            res.status(422).json({ errors: "Coś poszło nie tak" });
        }
    }
}

module.exports = new RecipeController();
