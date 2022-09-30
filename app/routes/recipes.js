const express = require("express");
const router = new express.Router();
const RecipeController = require("../controllers/recipe-controller");
const isAuthApiMiddleware = require("../middleware/is-auth-api-middleware");
const upload = require("../services/uploader");

router.post("/", isAuthApiMiddleware, RecipeController.create);
router.get("/", RecipeController.showAll);
router.get("/:slag", RecipeController.showOne);
router.get("/:slag/like", isAuthApiMiddleware, RecipeController.addLike);
router.get("/:slag/removelike", isAuthApiMiddleware, RecipeController.removeLike);
router.put("/:id/ingredient", isAuthApiMiddleware, RecipeController.ingredientAdd)
router.delete("/:id/ingredient", isAuthApiMiddleware, RecipeController.ingredientDelete)

router.put(
    "/:id",
    upload.single("image"),
    isAuthApiMiddleware,
    RecipeController.edit
);

router.delete("/:id", isAuthApiMiddleware, RecipeController.delete);
router.delete("/:id/:img", isAuthApiMiddleware, RecipeController.deleteImg);


module.exports = router;
